create extension if not exists "pgcrypto";

create table if not exists projects (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null, title_en text not null,
  category_tr text not null, category_en text not null,
  description_tr text not null, description_en text not null,
  year text not null, href text not null, color text not null default '#0066ff',
  cover_image text, published boolean not null default false,
  archived boolean not null default false, sort_order integer not null default 0,
  created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create table if not exists logo_works (
  id uuid primary key default gen_random_uuid(),
  title_tr text not null, title_en text not null,
  category_tr text not null, category_en text not null,
  description_tr text not null, description_en text not null,
  initials text not null, color text not null default '#0066ff', logo_image text,
  published boolean not null default false, archived boolean not null default false,
  sort_order integer not null default 0, created_at timestamptz not null default now(), updated_at timestamptz not null default now()
);

create index if not exists projects_published_sort_order_idx on projects (published, archived, sort_order);
create index if not exists logo_works_published_sort_order_idx on logo_works (published, archived, sort_order);

create table if not exists contact_requests (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  email text not null,
  phone text,
  project text not null,
  locale text not null check (locale in ('tr', 'en')),
  status text not null default 'new' check (status in ('new', 'in_progress', 'completed')),
  admin_note text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists contact_requests_status_created_at_idx on contact_requests (status, created_at desc);

alter table contact_requests
  add column if not exists retention_until timestamptz,
  add column if not exists retention_hold boolean not null default false;

update contact_requests
set retention_until = updated_at + interval '24 months'
where retention_until is null;

alter table contact_requests
  alter column retention_until set default (now() + interval '24 months'),
  alter column retention_until set not null;

create index if not exists contact_requests_retention_idx
  on contact_requests (retention_until)
  where retention_hold = false;

create table if not exists contact_deletion_audits (
  id uuid primary key default gen_random_uuid(),
  run_id uuid not null,
  actor text not null check (length(actor) between 1 and 80),
  reason text not null check (reason in ('retention_expired', 'manual_request')),
  deleted_count integer not null check (deleted_count >= 0),
  executed_at timestamptz not null default now(),
  expires_at timestamptz not null default (now() + interval '3 years')
);

create index if not exists contact_deletion_audits_expires_at_idx
  on contact_deletion_audits (expires_at);

create table if not exists security_rate_limits (
  scope text not null,
  identifier_hash text not null check (length(identifier_hash) = 64),
  window_started_at timestamptz not null,
  request_count integer not null check (request_count > 0),
  primary key (scope, identifier_hash)
);

create index if not exists security_rate_limits_window_started_at_idx on security_rate_limits (window_started_at);

create table if not exists admin_sessions (
  session_id_hash text primary key check (length(session_id_hash) = 64),
  email text not null,
  expires_at timestamptz not null,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists admin_sessions_expires_at_idx on admin_sessions (expires_at);
