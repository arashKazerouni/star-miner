-- Approved Star-Miner retention economics:
-- 0.05 FARM/hour base mining rate.
-- 0.01 FARM/hour referral bonus per successful referral.
-- 10 FARM minimum withdrawal threshold.

update public.profiles
set mining_rate = 0.05 + greatest(referrals, 0) * 0.01;

create or replace function public.claim_referral(referral_code_input text)
returns boolean
language plpgsql
security definer set search_path = public
as $$
declare
  inviter uuid;
  invitee uuid := auth.uid();
begin
  if invitee is null or referral_code_input is null or length(trim(referral_code_input)) = 0 then
    return false;
  end if;

  select id into inviter
  from public.profiles
  where referral_code = upper(trim(referral_code_input));

  if inviter is null or inviter = invitee then
    return false;
  end if;

  insert into public.referrals (inviter_id, invitee_id)
  values (inviter, invitee)
  on conflict (invitee_id) do nothing;

  if not found then
    return false;
  end if;

  update public.profiles
  set referrals = referrals + 1,
      mining_rate = 0.05 + (referrals + 1) * 0.01
  where id = inviter;

  return true;
end;
$$;

grant execute on function public.claim_referral(text) to authenticated;

create or replace function public.sync_mining()
returns table (
  balance numeric,
  referrals integer,
  mining_rate numeric,
  last_mining_update timestamptz,
  referral_code text
)
language plpgsql
security definer set search_path = public
as $$
declare
  profile public.profiles%rowtype;
  elapsed_seconds numeric;
  reward numeric;
  effective_rate numeric;
begin
  insert into public.profiles (id)
  values (auth.uid())
  on conflict (id) do nothing;

  select * into profile
  from public.profiles
  where id = auth.uid()
  for update;

  effective_rate := 0.05 + greatest(profile.referrals, 0) * 0.01;
  elapsed_seconds := greatest(extract(epoch from (now() - profile.last_mining_update)), 0);
  reward := effective_rate * (elapsed_seconds / 3600);

  update public.profiles
  set balance = profile.balance + reward,
      mining_rate = effective_rate,
      last_mining_update = now()
  where id = profile.id
  returning profiles.balance, profiles.referrals, profiles.mining_rate,
            profiles.last_mining_update, profiles.referral_code
  into balance, referrals, mining_rate, last_mining_update, referral_code;

  return next;
end;
$$;

grant execute on function public.sync_mining() to authenticated;

create or replace function public.request_withdrawal(wallet_address_input text)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  profile public.profiles%rowtype;
  withdrawal public.withdrawals%rowtype;
  elapsed_seconds numeric;
  reward numeric;
  withdrawal_amount numeric;
  normalized_wallet text;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  normalized_wallet := upper(trim(coalesce(wallet_address_input, '')));
  if normalized_wallet !~ '^G[A-Z2-7]{55}$' then
    raise exception 'Invalid Stellar wallet address';
  end if;

  select * into profile
  from public.profiles
  where id = current_user_id
  for update;

  if not found then
    raise exception 'Profile not found';
  end if;

  elapsed_seconds := greatest(extract(epoch from (now() - profile.last_mining_update)), 0);
  reward := profile.mining_rate * (elapsed_seconds / 3600);
  withdrawal_amount := profile.balance + reward;

  if withdrawal_amount < 10 then
    raise exception 'Minimum withdrawal is 10 FARM';
  end if;

  update public.profiles
  set balance = 0,
      last_mining_update = now()
  where id = current_user_id;

  insert into public.withdrawals (user_id, amount, wallet_address)
  values (current_user_id, withdrawal_amount, normalized_wallet)
  returning * into withdrawal;

  return withdrawal;
end;
$$;

grant execute on function public.request_withdrawal(text) to authenticated;
