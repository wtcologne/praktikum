-- Fix semester_id column type in all tables
-- Change from UUID to TEXT since we use simple identifiers like "WS25", "SS25"

-- Step 1: Drop all policies that depend on semester_id
DROP POLICY IF EXISTS "j_tutor_read" ON journal_entries;
DROP POLICY IF EXISTS "j_tutor_update" ON journal_entries;
DROP POLICY IF EXISTS "o_tutor_read" ON observation_forms;
DROP POLICY IF EXISTS "o_tutor_update" ON observation_forms;

-- Step 2: Drop any other policies that might interfere
DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete own journal entries" ON journal_entries;

-- Step 3: Drop all foreign key constraints on semester_id
ALTER TABLE IF EXISTS journal_entries DROP CONSTRAINT IF EXISTS journal_entries_semester_id_fkey;
ALTER TABLE IF EXISTS observation_forms DROP CONSTRAINT IF EXISTS observation_forms_semester_id_fkey;
ALTER TABLE IF EXISTS profiles DROP CONSTRAINT IF EXISTS profiles_semester_id_fkey;

-- Step 4: Modify the columns to TEXT
ALTER TABLE profiles ALTER COLUMN semester_id TYPE TEXT;
ALTER TABLE observation_forms ALTER COLUMN semester_id TYPE TEXT;

-- For journal_entries, check if column exists and modify/add it
DO $$ 
BEGIN
    IF EXISTS (
        SELECT 1 
        FROM information_schema.columns 
        WHERE table_name = 'journal_entries' 
        AND column_name = 'semester_id'
    ) THEN
        ALTER TABLE journal_entries ALTER COLUMN semester_id TYPE TEXT;
    ELSE
        ALTER TABLE journal_entries ADD COLUMN semester_id TEXT;
    END IF;
END $$;

-- Step 5: Set NOT NULL constraints where needed
ALTER TABLE observation_forms ALTER COLUMN semester_id SET NOT NULL;
ALTER TABLE journal_entries ALTER COLUMN semester_id SET NOT NULL;

-- Step 6: Recreate the simple policies (same as in supabase-simple-policies.sql)
-- Only create if it doesn't exist
DO $$ 
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM pg_policies 
        WHERE tablename = 'journal_entries' 
        AND policyname = 'Enable all for authenticated users'
    ) THEN
        CREATE POLICY "Enable all for authenticated users" ON journal_entries
          FOR ALL USING (auth.role() = 'authenticated');
    END IF;
END $$;

-- Add comments
COMMENT ON COLUMN profiles.semester_id IS 'Semester identifier (e.g., WS25, SS25)';
COMMENT ON COLUMN observation_forms.semester_id IS 'Semester identifier (e.g., WS25, SS25)';
COMMENT ON COLUMN journal_entries.semester_id IS 'Semester identifier (e.g., WS25, SS25)';