-- First, ensure the name column exists
ALTER TABLE profiles ADD COLUMN IF NOT EXISTS name TEXT;

-- Check existing policies
SELECT policyname, cmd 
FROM pg_policies 
WHERE tablename = 'profiles';

-- Drop existing update policy if it exists and recreate it
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;

-- Create comprehensive update policy
CREATE POLICY "Users can update own profile"
ON profiles
FOR UPDATE
TO authenticated
USING (auth.uid() = id)
WITH CHECK (auth.uid() = id);

-- Verify the policy was created
SELECT policyname, cmd, qual, with_check
FROM pg_policies 
WHERE tablename = 'profiles' AND cmd = 'UPDATE';
