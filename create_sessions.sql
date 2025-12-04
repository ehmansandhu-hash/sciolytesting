-- Create student_sessions table
create table public.student_sessions (
  id uuid default uuid_generate_v4() primary key,
  student_name text not null,
  test_id uuid references public.tests(id),
  test_title text,
  started_at timestamp with time zone default timezone('utc'::text, now()) not null,
  completed_at timestamp with time zone,
  status text default 'in_progress' -- 'in_progress', 'completed'
);

-- Enable RLS
alter table public.student_sessions enable row level security;

-- Policies
-- Anon can insert (start test)
create policy "Allow anon insert sessions"
on public.student_sessions for insert
to anon
with check (true);

-- Anon can update (finish test) - ideally restricted to own session but shared password...
create policy "Allow anon update sessions"
on public.student_sessions for update
to anon
using (true);

-- Public read (for dashboard)
create policy "Allow public read sessions"
on public.student_sessions for select
to anon
using (true);

-- Add to Realtime
alter publication supabase_realtime add table public.student_sessions;
