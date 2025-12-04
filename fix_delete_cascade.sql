-- Drop the existing foreign key constraint
alter table public.student_sessions
drop constraint student_sessions_test_id_fkey;

-- Re-add the constraint with ON DELETE CASCADE
alter table public.student_sessions
add constraint student_sessions_test_id_fkey
foreign key (test_id)
references public.tests(id)
on delete cascade;
