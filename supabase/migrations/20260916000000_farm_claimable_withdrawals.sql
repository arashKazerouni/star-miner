alter table public.withdrawals
  add column if not exists claimable_balance_id text;

create unique index if not exists withdrawals_claimable_balance_id_unique_idx
  on public.withdrawals (claimable_balance_id)
  where claimable_balance_id is not null;

create or replace function public.complete_withdrawal(
  withdrawal_id_input bigint,
  tx_hash_input text
)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
begin
  return public.complete_withdrawal(
    withdrawal_id_input,
    tx_hash_input,
    null
  );
end;
$$;

grant execute on function public.complete_withdrawal(bigint, text) to authenticated;

create or replace function public.complete_withdrawal(
  withdrawal_id_input bigint,
  tx_hash_input text,
  claimable_balance_id_input text
)
returns public.withdrawals
language plpgsql
security definer set search_path = public
as $$
declare
  current_user_id uuid := auth.uid();
  withdrawal public.withdrawals%rowtype;
  normalized_hash text := lower(trim(coalesce(tx_hash_input, '')));
  normalized_balance_id text := lower(trim(coalesce(claimable_balance_id_input, '')));
begin
  if current_user_id is null then
    raise exception 'Authentication required';
  end if;

  if normalized_hash !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid Stellar transaction hash';
  end if;

  if normalized_balance_id <> '' and normalized_balance_id !~ '^[0-9a-f]{64}$' then
    raise exception 'Invalid Stellar claimable balance ID';
  end if;

  update public.withdrawals
  set status = 'completed',
      tx_hash = normalized_hash,
      claimable_balance_id = nullif(normalized_balance_id, ''),
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

    if coalesce(withdrawal.claimable_balance_id, '') <> normalized_balance_id then
      raise exception 'Withdrawal already completed with different settlement data';
    end if;
  end if;

  return withdrawal;
end;
$$;

grant execute on function public.complete_withdrawal(bigint, text, text) to authenticated;
