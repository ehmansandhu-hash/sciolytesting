-- Add is_published column to tests table
alter table public.tests
add column is_published boolean default false;

-- Update existing tests to be unpublished by default (already covered by default, but good to be explicit if needed)
-- update public.tests set is_published = false where is_published is null;
