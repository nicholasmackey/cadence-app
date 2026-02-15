create extension if not exists pgcrypto;

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.families (
  id uuid primary key default gen_random_uuid(),
  owner_profile_id uuid not null references public.profiles (id) on delete cascade,
  name text not null,
  created_at timestamptz not null default now()
);

create table if not exists public.family_members (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  user_id uuid not null references public.profiles (id) on delete cascade,
  role text not null check (role in ('owner', 'member')),
  created_at timestamptz not null default now(),
  unique (family_id, user_id)
);

create table if not exists public.children (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  name text not null,
  birth_year integer,
  created_at timestamptz not null default now(),
  constraint children_birth_year_check
    check (birth_year is null or (birth_year >= 1900 and birth_year <= 2100)),
  unique (id, family_id)
);

create table if not exists public.activities (
  id uuid primary key default gen_random_uuid(),
  family_id uuid not null references public.families (id) on delete cascade,
  child_id uuid not null,
  occurred_at timestamptz not null default now(),
  subject text not null,
  duration_minutes integer,
  notes text,
  created_at timestamptz not null default now(),
  constraint activities_duration_minutes_check
    check (duration_minutes is null or duration_minutes > 0),
  constraint activities_child_id_family_id_fkey
    foreign key (child_id, family_id)
    references public.children (id, family_id)
    on delete cascade
);

create index if not exists family_members_user_id_idx on public.family_members (user_id);
create index if not exists children_family_id_idx on public.children (family_id);
create index if not exists activities_family_id_idx on public.activities (family_id);
create index if not exists activities_child_id_occurred_at_idx
  on public.activities (child_id, occurred_at desc);

create or replace function public.is_family_member(target_family_id uuid)
returns boolean
language sql
stable
security definer
set search_path = public
as $$
  select exists (
    select 1
    from public.family_members fm
    where fm.family_id = target_family_id
      and fm.user_id = auth.uid()
  );
$$;

alter table public.profiles enable row level security;
alter table public.families enable row level security;
alter table public.family_members enable row level security;
alter table public.children enable row level security;
alter table public.activities enable row level security;

create policy "profiles_select_self"
  on public.profiles
  for select
  using (id = auth.uid());

create policy "profiles_insert_self"
  on public.profiles
  for insert
  with check (id = auth.uid());

create policy "profiles_update_self"
  on public.profiles
  for update
  using (id = auth.uid())
  with check (id = auth.uid());

create policy "families_select_member"
  on public.families
  for select
  using (public.is_family_member(id));

create policy "families_insert_owner"
  on public.families
  for insert
  with check (owner_profile_id = auth.uid());

create policy "families_update_owner"
  on public.families
  for update
  using (owner_profile_id = auth.uid())
  with check (owner_profile_id = auth.uid());

create policy "family_members_select_member"
  on public.family_members
  for select
  using (public.is_family_member(family_id));

create policy "family_members_insert_owner_bootstrap"
  on public.family_members
  for insert
  with check (
    user_id = auth.uid()
    and role = 'owner'
    and exists (
      select 1
      from public.families f
      where f.id = family_id
        and f.owner_profile_id = auth.uid()
    )
  );

create policy "children_select_member"
  on public.children
  for select
  using (public.is_family_member(family_id));

create policy "children_insert_member"
  on public.children
  for insert
  with check (public.is_family_member(family_id));

create policy "children_update_member"
  on public.children
  for update
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

create policy "activities_select_member"
  on public.activities
  for select
  using (public.is_family_member(family_id));

create policy "activities_insert_member"
  on public.activities
  for insert
  with check (
    public.is_family_member(family_id)
    and exists (
      select 1
      from public.children c
      where c.id = child_id
        and c.family_id = activities.family_id
    )
  );

create policy "activities_update_member"
  on public.activities
  for update
  using (public.is_family_member(family_id))
  with check (public.is_family_member(family_id));

grant usage on schema public to authenticated;
grant select, insert, update on public.profiles to authenticated;
grant select, insert, update on public.families to authenticated;
grant select, insert on public.family_members to authenticated;
grant select, insert, update on public.children to authenticated;
grant select, insert, update on public.activities to authenticated;
