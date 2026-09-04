create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  balance numeric(30,18) not null default 0.000013,
  referrals integer not null default 0 check (referrals >= 0),
  mining_rate numeric(30,18) not null default 0.000001,
  last_mining_update timestamptz not null default now(),
  referral_code text not null unique default upper(substr(md5(gen_random_uuid()::text), 1, 8)),
  created_at timestamptz not null default now()
);

create table if not exists public.referrals (
  id bigint generated always as identity primary key,
  inviter_id uuid not null references public.profiles(id) on delete cascade,
  invitee_id uuid not null unique references public.profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  check (inviter_id <> invitee_id)
);

alter table public.profiles enable row level security;
alter table public.referrals enable row level security;

create policy "profiles_select_own" on public.profiles
  for select using (auth.uid() = id);

create policy "referrals_select_own" on public.referrals
  for select using (auth.uid() = inviter_id or auth.uid() = invitee_id);

create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id) values (new.id)
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
after insert on auth.users
for each row execute procedure public.handle_new_user();

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
      mining_rate = 0.000001 + (referrals + 1) * 0.000001
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
  select * into profile
  from public.profiles
  where id = auth.uid()
  for update;

  if profile.id is null then
    return;
  end if;

  elapsed_seconds := greatest(extract(epoch from (now() - profile.last_mining_update)), 0);
  reward := profile.mining_rate * elapsed_seconds;

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
