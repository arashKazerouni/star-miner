-- Mining rate v2: FARM/hour, calibrated for ~16.7 days to reach the
-- current 0.001 FARM withdrawal threshold at the base rate.
-- Referral bonus adds 20% of the base rate per referral.

update public.profiles
set mining_rate = 0.0000025 + greatest(referrals, 0) * 0.0000005
where mining_rate = 0.000001;

alter table public.profiles
  alter column mining_rate set default 0.0000025;

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
      mining_rate = 0.0000025 + (referrals + 1) * 0.0000005
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
begin
  insert into public.profiles (id)
  values (auth.uid())
  on conflict (id) do nothing;

  select * into profile
  from public.profiles
  where id = auth.uid()
  for update;

  elapsed_seconds := greatest(extract(epoch from (now() - profile.last_mining_update)), 0);
  reward := profile.mining_rate * (elapsed_seconds / 3600);

  update public.profiles
  set balance = profile.balance + reward,
      last_mining_update = now()
  where id = profile.id
  returning profiles.balance, profiles.referrals, profiles.mining_rate,
            profiles.last_mining_update, profiles.referral_code
  into balance, referrals, mining_rate, last_mining_update, referral_code;

  return next;
end;
$$;

grant execute on function public.sync_mining() to authenticated;
