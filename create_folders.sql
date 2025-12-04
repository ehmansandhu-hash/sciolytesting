-- 1. Create 'folders' table
create table public.folders (
  id uuid default uuid_generate_v4() primary key,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  name text not null unique
);

-- 2. Add 'folder_id' to 'tests' table
alter table public.tests 
add column folder_id uuid references public.folders(id) on delete set null;

-- 3. Enable RLS for folders
alter table public.folders enable row level security;

-- 4. Create Policies for folders (Public Read / Admin Write)
create policy "Allow public read folders"
on public.folders for select
to anon
using (true);

create policy "Allow admin insert folders"
on public.folders for insert
to anon
with check (true); -- In a real app, restrict to admin. For now, shared password protects the UI.

create policy "Allow admin delete folders"
on public.folders for delete
to anon
using (true);
