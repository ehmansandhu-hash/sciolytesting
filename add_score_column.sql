-- Add score column to student_sessions table
alter table public.student_sessions 
add column score numeric; -- Using numeric to allow for decimals if needed

-- Update RLS policies if necessary (existing policies should cover update if admin)
-- Ensure Realtime is enabled for this table (it should be already)
