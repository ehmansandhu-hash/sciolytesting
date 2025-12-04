-- Allow anon to insert tests (for Upload)
create policy "Allow anon insert tests"
on public.tests for insert
to anon
with check (true);

-- Allow anon to delete tests
create policy "Allow anon delete tests"
on public.tests for delete
to anon
using (true);

-- Allow anon to update tests (for soft delete or edits if we add them)
create policy "Allow anon update tests"
on public.tests for update
to anon
using (true);

-- Allow anon to update settings (for Session Toggle)
create policy "Allow anon update settings"
on public.settings for update
to anon
using (true);
create policy "Allow anon insert settings"
on public.settings for insert
to anon
with check (true);
