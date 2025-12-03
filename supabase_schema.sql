-- Enable UUID extension
create extension if not exists "uuid-ossp";

-- 1. Create 'tests' table
create table public.tests (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  title text not null,
  duration_minutes integer not null default 50,
  pdf_url text not null,
  is_active boolean default false
);

-- 2. Create 'logs' table
create table public.logs (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  student_name text not null,
  test_id uuid references public.tests(id),
  test_title text -- Denormalized for easier querying
);

-- 3. Create 'settings' table (for global session toggle)
create table public.settings (
  key text primary key,
  value text,
  updated_at timestamp with time zone default timezone('utc'::text, now())
);

-- Insert default setting
insert into public.settings (key, value) values ('session_active', 'false');

-- 4. Enable Row Level Security (RLS)
alter table public.tests enable row level security;
alter table public.logs enable row level security;
alter table public.settings enable row level security;

-- 5. Create Policies (Public Read / Anon Write for simplicity in this MVP)
-- In a real app, you'd want stricter policies, but for this shared-password app:

-- Tests: Everyone can read active tests. Only service role (admin) can write.
create policy "Allow public read access to tests"
on public.tests for select
to anon
using (true);

-- Logs: Anon can insert (when student starts). Admin can read all.
create policy "Allow anon insert logs"
on public.logs for insert
to anon
with check (true);

create policy "Allow anon read logs"
on public.logs for select
to anon
using (true);

-- Settings: Public read.
create policy "Allow public read settings"
on public.settings for select
to anon
using (true);

-- STORAGE SETUP
-- You need to create a bucket named 'pdfs' in the Storage dashboard manually,
-- OR run this if you have permissions (often requires dashboard):
insert into storage.buckets (id, name, public) values ('pdfs', 'pdfs', true);

-- Storage Policy: Allow public read
create policy "Public Access"
on storage.objects for select
to anon
using ( bucket_id = 'pdfs' );

-- Storage Policy: Allow anon upload (for admin dashboard to work easily without auth context)
create policy "Public Upload"
on storage.objects for insert
to anon
with check ( bucket_id = 'pdfs' );
