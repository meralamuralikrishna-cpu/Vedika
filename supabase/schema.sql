-- Run this in the Supabase SQL Editor.
-- Vedika saves one private JSON workspace per account. Booking requests use
-- the shared booking_requests table below so admins can review them across users.
create table if not exists public.user_data (
  user_id uuid primary key references auth.users(id) on delete cascade,
  payload jsonb not null default '{}'::jsonb,
  updated_at timestamptz not null default now(),
  constraint user_data_payload_is_object check (jsonb_typeof(payload) = 'object')
);

-- Keep the schema safe to re-run when updating an existing project.
do $$
begin
  if not exists (
    select 1 from pg_constraint
    where conname = 'user_data_payload_is_object'
      and conrelid = 'public.user_data'::regclass
  ) then
    alter table public.user_data
      add constraint user_data_payload_is_object
      check (jsonb_typeof(payload) = 'object');
  end if;
end
$$;

alter table public.user_data enable row level security;

-- No public/anonymous access. Signed-in users can only access their own row.
revoke all on table public.user_data from anon, authenticated;
grant select, insert, update on table public.user_data to authenticated;

drop policy if exists "Users can read their own data" on public.user_data;
drop policy if exists "Users can insert their own data" on public.user_data;
drop policy if exists "Users can update their own data" on public.user_data;

create policy "Users can read their own data" on public.user_data
  for select to authenticated using ((select auth.uid()) = user_id);

create policy "Users can insert their own data" on public.user_data
  for insert to authenticated with check ((select auth.uid()) = user_id);

create policy "Users can update their own data" on public.user_data
  for update to authenticated using ((select auth.uid()) = user_id)
  with check ((select auth.uid()) = user_id);

comment on table public.user_data is
  'Private Vedika workspace data, stored as one JSON document per authenticated user.';
comment on column public.user_data.payload is
  'JSON object containing designs, moodboards, profile, favorites, locale, notifications, and active design.';

-- Booking requests are separate so authorized admins can review requests across accounts.
create table if not exists public.booking_requests (
  id uuid primary key default gen_random_uuid(),
  owner_id uuid not null references auth.users(id) on delete cascade,
  requester_name text,
  requester_email text,
  vendor_name text,
  design_id text,
  design_name text,
  design_type text,
  design_snapshot jsonb,
  event_details jsonb not null default '{}'::jsonb,
  event_date date not null,
  event_type text not null,
  venue text,
  notes text,
  status_note text,
  status text not null default 'pending' check (status in ('pending', 'under_review', 'changes_requested', 'approved', 'rejected')),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

alter table public.booking_requests add column if not exists requester_name text;
alter table public.booking_requests add column if not exists requester_email text;
alter table public.booking_requests alter column vendor_name drop not null;
alter table public.booking_requests add column if not exists design_id text;
alter table public.booking_requests add column if not exists design_name text;
alter table public.booking_requests add column if not exists design_type text;
alter table public.booking_requests add column if not exists design_snapshot jsonb;
alter table public.booking_requests add column if not exists event_details jsonb not null default '{}'::jsonb;
alter table public.booking_requests add column if not exists status_note text;

-- Expand booking workflow statuses while preserving legacy decisions.
alter table public.booking_requests drop constraint if exists booking_requests_status_check;
update public.booking_requests set status = 'approved' where status = 'confirmed';
update public.booking_requests set status = 'rejected' where status = 'declined';
alter table public.booking_requests add constraint booking_requests_status_check
  check (status in ('pending', 'under_review', 'changes_requested', 'approved', 'rejected'));

alter table public.booking_requests enable row level security;
revoke all on table public.booking_requests from anon, authenticated;
grant select, insert, delete on table public.booking_requests to authenticated;
grant update (status, status_note, updated_at) on table public.booking_requests to authenticated;

drop policy if exists "Owners and admins can read booking requests" on public.booking_requests;
drop policy if exists "Users can submit their own booking requests" on public.booking_requests;
drop policy if exists "Admins can decide booking requests" on public.booking_requests;
drop policy if exists "Owners can delete their booking requests" on public.booking_requests;

create policy "Owners and admins can read booking requests" on public.booking_requests
  for select to authenticated
  using (
    owner_id = (select auth.uid())
    or (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

create policy "Users can submit their own booking requests" on public.booking_requests
  for insert to authenticated
  with check (
    owner_id = (select auth.uid())
    and status = 'pending'
  );

create policy "Admins can decide booking requests" on public.booking_requests
  for update to authenticated
  using ((select auth.jwt()->'app_metadata'->>'role') = 'admin')
  with check ((select auth.jwt()->'app_metadata'->>'role') = 'admin');

create policy "Owners can delete their booking requests" on public.booking_requests
  for delete to authenticated
  using (
    owner_id = (select auth.uid())
    or (select auth.jwt()->'app_metadata'->>'role') = 'admin'
  );

comment on table public.booking_requests is
  'User booking requests. Admin access is granted only by the trusted app_metadata role claim; status_note explains admin decisions.';

-- Share links are stored separately because guests can read and comment without
-- an account. The unguessable UUID share id is the public link credential.
create table if not exists public.shared_designs (
  id uuid primary key,
  owner_id uuid not null references auth.users(id) on delete cascade,
  design_id text not null,
  name text not null,
  elements jsonb not null default '[]'::jsonb,
  settings jsonb not null default '{}'::jsonb,
  venue_plan jsonb not null default '{}'::jsonb,
  status text not null default 'pending' check (status in ('pending', 'approved', 'changes')),
  comments jsonb not null default '[]'::jsonb check (jsonb_typeof(comments) = 'array'),
  created_at timestamptz not null default now(),
  approved_at timestamptz,
  approved_by text
);

alter table public.shared_designs enable row level security;

revoke all on table public.shared_designs from anon, authenticated;
grant select (id, design_id, name, elements, settings, venue_plan, status, comments, created_at, approved_at, approved_by)
  on table public.shared_designs to anon, authenticated;
grant select (owner_id) on table public.shared_designs to authenticated;
grant insert (id, owner_id, design_id, name, elements, settings, venue_plan, status, comments)
  on table public.shared_designs to authenticated;
grant delete on table public.shared_designs to authenticated;

drop policy if exists "Anyone can read a share link" on public.shared_designs;
drop policy if exists "Users can create their own share links" on public.shared_designs;
drop policy if exists "Guests can leave share feedback" on public.shared_designs;
drop policy if exists "Owners can revoke share links" on public.shared_designs;
drop policy if exists "Owners can delete share links" on public.shared_designs;

create policy "Anyone can read a share link" on public.shared_designs
  for select to anon, authenticated using (true);

create policy "Users can create their own share links" on public.shared_designs
  for insert to authenticated with check ((select auth.uid()) = owner_id);

create policy "Owners can delete share links" on public.shared_designs
  for delete to authenticated using ((select auth.uid()) = owner_id);

comment on table public.shared_designs is
  'Design snapshots shared by UUID link; guests can read and submit feedback through constrained database functions, while owners can revoke links.';

-- Guests may append comments and set feedback status, but cannot rewrite the
-- shared design snapshot or forge approval metadata with a direct table update.
create or replace function public.add_shared_design_comment(p_share_id uuid, p_comment jsonb)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if jsonb_typeof(p_comment) <> 'object'
     or nullif(trim(p_comment->>'body'), '') is null
     or length(p_comment->>'body') > 2000 then
    raise exception 'A comment between 1 and 2000 characters is required';
  end if;
  update public.shared_designs
    set comments = comments || jsonb_build_array(p_comment)
    where id = p_share_id;
  if not found then raise exception 'Share link not found'; end if;
end;
$$;

create or replace function public.set_shared_design_feedback(p_share_id uuid, p_status text, p_approved_by text)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  if p_status not in ('approved', 'changes') then
    raise exception 'Unsupported feedback status';
  end if;
  update public.shared_designs
    set status = p_status,
        approved_at = case when p_status = 'approved' then now() else null end,
        approved_by = case when p_status = 'approved' then left(coalesce(nullif(trim(p_approved_by), ''), 'Family guest'), 120) else null end
    where id = p_share_id;
  if not found then raise exception 'Share link not found'; end if;
end;
$$;

revoke all on function public.add_shared_design_comment(uuid, jsonb) from public;
revoke all on function public.set_shared_design_feedback(uuid, text, text) from public;
grant execute on function public.add_shared_design_comment(uuid, jsonb) to anon, authenticated;
grant execute on function public.set_shared_design_feedback(uuid, text, text) to anon, authenticated;
