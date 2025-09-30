-- Add name column to profiles table
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Update RLS policies to allow users to update their own name
-- (The existing policies should already cover this, but let's verify)

-- Check current policies
SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual, with_check
FROM pg_policies
WHERE tablename = 'profiles';
