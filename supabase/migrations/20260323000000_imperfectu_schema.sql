-- Imperfectu Supabase schema
-- Apply in Supabase SQL editor, or via: supabase db push / migration

create extension if not exists "pgcrypto";

-- ---------------------------------------------------------------------------
-- Enums
-- ---------------------------------------------------------------------------

do $$ begin
  create type public.maturity_rating as enum ('G', 'PG', 'PG-13', 'R', 'TV-MA', 'NR');
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.transmedia_kind as enum (
    'audio',
    'interactive',
    'document',
    'bts',
    'spatial',
    'download'
  );
exception when duplicate_object then null;
end $$;

do $$ begin
  create type public.media_genre as enum (
    'Drama',
    'Sci-Fi',
    'Thriller',
    'Documentary',
    'Experimental',
    'Horror',
    'Romance',
    'Fantasy',
    'Animation'
  );
exception when duplicate_object then null;
end $$;

-- ---------------------------------------------------------------------------
-- Profiles (1:1 with auth.users)
-- ---------------------------------------------------------------------------

create table if not exists public.profiles (
  id uuid primary key references auth.users (id) on delete cascade,
  email text,
  display_name text not null default '',
  avatar_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

-- ---------------------------------------------------------------------------
-- Catalog: media_items
-- ---------------------------------------------------------------------------

create table if not exists public.media_items (
  id text primary key,
  title text not null,
  description text not null default '',
  thumbnail_url text not null,
  backdrop_url text,
  trailer_url text not null default '',
  -- Progressive MP4 or HLS master playlist (.m3u8)
  main_video_url text not null,
  release_year integer not null check (release_year >= 1900 and release_year <= 2100),
  maturity_rating public.maturity_rating not null default 'NR',
  duration_minutes integer check (duration_minutes is null or duration_minutes > 0),
  tags text[] not null default '{}',
  genres public.media_genre[] not null default '{}',
  cast_members text[] not null default '{}',
  creators text[] not null default '{}',
  featured boolean not null default false,
  published boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists media_items_featured_idx on public.media_items (featured) where published;
create index if not exists media_items_genres_idx on public.media_items using gin (genres);
create index if not exists media_items_tags_idx on public.media_items using gin (tags);

-- ---------------------------------------------------------------------------
-- Chapter markers for the custom player
-- ---------------------------------------------------------------------------

create table if not exists public.media_chapters (
  id uuid primary key default gen_random_uuid(),
  media_id text not null references public.media_items (id) on delete cascade,
  label text not null,
  time_seconds numeric(10, 2) not null check (time_seconds >= 0),
  sort_order integer not null default 0,
  created_at timestamptz not null default now()
);

create index if not exists media_chapters_media_id_idx on public.media_chapters (media_id);

-- ---------------------------------------------------------------------------
-- Transmedia assets linked to a main title
-- ---------------------------------------------------------------------------

create table if not exists public.transmedia_items (
  id text primary key,
  media_id text not null references public.media_items (id) on delete cascade,
  kind public.transmedia_kind not null,
  title text not null,
  description text,
  asset_url text,
  file_url text,
  -- Choice trees / interactive payloads stored as JSONB
  interactive_payload jsonb,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists transmedia_items_media_id_idx on public.transmedia_items (media_id);
create index if not exists transmedia_items_kind_idx on public.transmedia_items (kind);

-- ---------------------------------------------------------------------------
-- Home / catalog curated rows
-- ---------------------------------------------------------------------------

create table if not exists public.content_rows (
  id text primary key,
  title text not null,
  sort_order integer not null default 0,
  published boolean not null default true,
  created_at timestamptz not null default now()
);

create table if not exists public.content_row_items (
  row_id text not null references public.content_rows (id) on delete cascade,
  media_id text not null references public.media_items (id) on delete cascade,
  sort_order integer not null default 0,
  primary key (row_id, media_id)
);

-- ---------------------------------------------------------------------------
-- Per-user watch progress
-- ---------------------------------------------------------------------------

create table if not exists public.watch_history (
  id uuid primary key default gen_random_uuid(),
  user_id uuid not null references auth.users (id) on delete cascade,
  media_id text not null references public.media_items (id) on delete cascade,
  progress_seconds numeric(12, 2) not null default 0 check (progress_seconds >= 0),
  duration_seconds numeric(12, 2) not null default 0 check (duration_seconds >= 0),
  completed boolean not null default false,
  last_watched_at timestamptz not null default now(),
  unique (user_id, media_id)
);

create index if not exists watch_history_user_id_idx on public.watch_history (user_id);
create index if not exists watch_history_last_watched_idx on public.watch_history (user_id, last_watched_at desc);

-- ---------------------------------------------------------------------------
-- updated_at helper
-- ---------------------------------------------------------------------------

create or replace function public.set_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists profiles_set_updated_at on public.profiles;
create trigger profiles_set_updated_at
  before update on public.profiles
  for each row execute function public.set_updated_at();

drop trigger if exists media_items_set_updated_at on public.media_items;
create trigger media_items_set_updated_at
  before update on public.media_items
  for each row execute function public.set_updated_at();

drop trigger if exists transmedia_items_set_updated_at on public.transmedia_items;
create trigger transmedia_items_set_updated_at
  before update on public.transmedia_items
  for each row execute function public.set_updated_at();

-- Auto-create profile on signup
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, email, display_name)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'display_name', split_part(coalesce(new.email, 'viewer'), '@', 1))
  )
  on conflict (id) do nothing;
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ---------------------------------------------------------------------------
-- Row Level Security
-- ---------------------------------------------------------------------------

alter table public.profiles enable row level security;
alter table public.media_items enable row level security;
alter table public.media_chapters enable row level security;
alter table public.transmedia_items enable row level security;
alter table public.content_rows enable row level security;
alter table public.content_row_items enable row level security;
alter table public.watch_history enable row level security;

-- Profiles: users read/update own row
drop policy if exists "profiles_select_own" on public.profiles;
create policy "profiles_select_own"
  on public.profiles for select
  using (auth.uid() = id);

drop policy if exists "profiles_update_own" on public.profiles;
create policy "profiles_update_own"
  on public.profiles for update
  using (auth.uid() = id)
  with check (auth.uid() = id);

-- Catalog: public read of published content (anon + authenticated)
drop policy if exists "media_items_public_read" on public.media_items;
create policy "media_items_public_read"
  on public.media_items for select
  using (published = true);

drop policy if exists "media_chapters_public_read" on public.media_chapters;
create policy "media_chapters_public_read"
  on public.media_chapters for select
  using (
    exists (
      select 1 from public.media_items m
      where m.id = media_id and m.published = true
    )
  );

drop policy if exists "transmedia_public_read" on public.transmedia_items;
create policy "transmedia_public_read"
  on public.transmedia_items for select
  using (
    published = true
    and exists (
      select 1 from public.media_items m
      where m.id = media_id and m.published = true
    )
  );

drop policy if exists "content_rows_public_read" on public.content_rows;
create policy "content_rows_public_read"
  on public.content_rows for select
  using (published = true);

drop policy if exists "content_row_items_public_read" on public.content_row_items;
create policy "content_row_items_public_read"
  on public.content_row_items for select
  using (
    exists (
      select 1 from public.content_rows r
      where r.id = row_id and r.published = true
    )
  );

-- Watch history: owner-only CRUD
drop policy if exists "watch_history_select_own" on public.watch_history;
create policy "watch_history_select_own"
  on public.watch_history for select
  using (auth.uid() = user_id);

drop policy if exists "watch_history_insert_own" on public.watch_history;
create policy "watch_history_insert_own"
  on public.watch_history for insert
  with check (auth.uid() = user_id);

drop policy if exists "watch_history_update_own" on public.watch_history;
create policy "watch_history_update_own"
  on public.watch_history for update
  using (auth.uid() = user_id)
  with check (auth.uid() = user_id);

drop policy if exists "watch_history_delete_own" on public.watch_history;
create policy "watch_history_delete_own"
  on public.watch_history for delete
  using (auth.uid() = user_id);

-- ---------------------------------------------------------------------------
-- Helpful view: media with transmedia flag
-- ---------------------------------------------------------------------------

create or replace view public.media_with_flags
with (security_invoker = true)
as
select
  m.*,
  exists (
    select 1
    from public.transmedia_items t
    where t.media_id = m.id and t.published = true
  ) as has_transmedia
from public.media_items m
where m.published = true;
