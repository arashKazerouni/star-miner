create table if not exists public.withdrawals (
  id bigint generated always as identity primary key,
  user_id uuid not null references public.profiles(id) on delete cascade,
  amount numeric(30,18) not null check (amount > 0),
  wallet_address text not null,
  status text not null default 'pending' check (status in ('pending', 'processing', 'completed', 'rejected')),
  created_at timestamptz not null default now(),
  processed_at timestamptz,
  check (wallet_address ~ '^G[A-Z2-7]{55}$')
);

create index if not exists withdrawals_user_id_created_at_idx
  on public.withdrawals (user_id, created_at desc);

alter table public.withdrawals enable row level security;

drop policy if exists "withdrawals_select_own" on public.withdrawals;
create policy "withdrawals_select_own" on public.withdrawals
  for select using (auth.uid() = user_id);

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
  reward := profile.mining_rate * (elapsed_seconds / 60);
  withdrawal_amount := profile.balance + reward;

  if withdrawal_amount < 0.001 then
    raise exception 'Minimum withdrawal is 0.001 XLM';
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
