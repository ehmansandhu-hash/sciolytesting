-- Drop the existing foreign key constraint on logs
alter table public.logs
drop constraint logs_test_id_fkey;

-- Re-add the constraint with ON DELETE CASCADE
alter table public.logs
add constraint logs_test_id_fkey
foreign key (test_id)
references public.tests(id)
on delete cascade;
