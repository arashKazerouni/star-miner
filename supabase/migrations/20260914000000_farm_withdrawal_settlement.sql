alter table public.withdrawals
  add column if not exists tx_hash text,
  add column if not exists error_message text;

create unique index if not exists withdrawals_tx_hash_unique_idx
  on public.withdrawals (tx_hash)
  where tx_hash is not null;

create unique index if not exists withdrawals_active_user_unique_idx
  on public.withdrawals (user_id)
  where status in ('pending', 'processing');

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
  accrued numeric;
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

  if exists (
    select 1 from public.withdrawals
    where user_id = current_user_id
      and status in ('pending', 'processing')
  ) then
    raise exception 'You already have a withdrawal in progress';
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
  accrued := greatest(profile.balance + reward, 0);
  withdrawal_amount := floor(accrued * 10000000) / 10000000;

  if withdrawal_amount < 4500 then
    raise exception 'Minimum withdrawal is 4500 FARM';
  end if;

  update public.profiles
  set balance = accrued - withdrawal_amount,
      last_mining_update = now()
  where id = current_user_id;

  insert into public.withdrawals (user_id, amount, wallet_address)
  values (current_user_id, withdrawal_amount, normalized_wallet)
  returning * into withdrawal;

  return withdrawal;
end;
$$;

grant execute on function public.request_withdrawal(text) to authenticated;

create or replace function public.mark_withdrawal_processing(withdrawal_id_input bigint)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  withdrawal public.withdrawals%rowtype;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  update public.withdrawals
  set status = 'processing'
  where id = withdrawal_id_input
    and user_id = current_user_id
    and status = 'pending'
  returning * into withdrawal;

  if not found then
    select * into withdrawal
    from public.withdrawals
    where id = withdrawal_id_input
      and user_id = current_user_id;

    if not found then
      raise exception 'Withdrawal not found';
    end if;

    if withdrawal.status not in ('processing', 'completed') then
      raise exception 'Withdrawal cannot be processed';
    end if;
  end if;

  return withdrawal;
end;
$$;

grant execute on function public.mark_withdrawal_processing(bigint) to authenticated;

create or replace function public.complete_withdrawal(
  withdrawal_id_input bigint,
  tx_hash_input text
)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  withdrawal public.withdrawals%rowtype;
  normalized_hash text := lower(trim(coalesce(tx_hash_input, '')));
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if normalized_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid Stellar transaction hash';
  end if;

  update public.withdrawals
  set status = 'completed',
      tx_hash = normalized_hash,
      processed_at = now(),
      error_message = null
  where id = withdrawal_id_input
    and user_id = current_user_id
    and status in ('pending', 'processing')
  returning * into withdrawal;

  if not found then
    select * into withdrawal
    from public.withdrawals
    where id = withdrawal_id_input
      and user_id = current_user_id;

    if not found then
      raise exception 'Withdrawal not found';
    end if;

    if withdrawal.status <> 'completed' then
      raise exception 'Withdrawal cannot be completed';
    end if;

    if withdrawal.tx_hash <> normalized_hash then
      raise exception 'Withdrawal already completed with a different transaction';
    end if;
  end if;

  return withdrawal;
end;
$$;

grant execute on function public.complete_withdrawal(bigint, text) to authenticated;

create or replace function public.fail_withdrawal(
  withdrawal_id_input bigint,
  error_message_input text
)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  withdrawal public.withdrawals%rowtype;
  profile public.profiles%rowtype;
  elapsed_seconds numeric;
  reward numeric;
  restored_balance numeric;
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  select * into withdrawal
  from public.withdrawals
  where id = withdrawal_id_input
    and user_id = current_user_id
  for update;

  if not found then
    raise exception 'Withdrawal not found';
  end if;

  if withdrawal.status = 'rejected' then
    return withdrawal;
  end if;

  if withdrawal.status = 'completed' then
    raise exception 'Completed withdrawal cannot be rejected';
  end if;

  select * into profile
  from public.profiles
  where id = current_user_id
  for update;

  elapsed_seconds := greatest(extract(epoch from (now() - profile.last_mining_update)), 0);
  reward := profile.mining_rate * (elapsed_seconds / 3600);
  restored_balance := profile.balance + reward + withdrawal.amount;

  update public.profiles
  set balance = restored_balance,
      last_mining_update = now()
  where id = current_user_id;

  update public.withdrawals
  set status = 'rejected',
      processed_at = now(),
      error_message = left(coalesce(error_message_input, 'Withdrawal failed'), 500)
  where id = withdrawal_id_input
  returning * into withdrawal;

  return withdrawal;
end;
$$;

grant execute on function public.fail_withdrawal(bigint, text) to authenticated;
