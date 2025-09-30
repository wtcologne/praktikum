-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_forms ENABLE ROW LEVEL SECURITY;
ALTER TABLE observation_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE journal_entries ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view own profile" ON profiles;
DROP POLICY IF EXISTS "Users can update own profile" ON profiles;
DROP POLICY IF EXISTS "Users can insert own profile" ON profiles;

DROP POLICY IF EXISTS "Users can view own observation forms" ON observation_forms;
DROP POLICY IF EXISTS "Users can insert own observation forms" ON observation_forms;
DROP POLICY IF EXISTS "Users can update own observation forms" ON observation_forms;
DROP POLICY IF EXISTS "Users can delete own observation forms" ON observation_forms;

DROP POLICY IF EXISTS "Users can view own observation entries" ON observation_entries;
DROP POLICY IF EXISTS "Users can insert own observation entries" ON observation_entries;
DROP POLICY IF EXISTS "Users can update own observation entries" ON observation_entries;
DROP POLICY IF EXISTS "Users can delete own observation entries" ON observation_entries;

DROP POLICY IF EXISTS "Users can view own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can insert own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can update own journal entries" ON journal_entries;
DROP POLICY IF EXISTS "Users can delete own journal entries" ON journal_entries;

-- Profiles policies
CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON profiles
  FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Users can insert own profile" ON profiles
  FOR INSERT WITH CHECK (auth.uid() = id);

-- Observation Forms policies
CREATE POLICY "Users can view own observation forms" ON observation_forms
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own observation forms" ON observation_forms
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own observation forms" ON observation_forms
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own observation forms" ON observation_forms
  FOR DELETE USING (auth.uid() = author_id);

-- Observation Entries policies
CREATE POLICY "Users can view own observation entries" ON observation_entries
  FOR SELECT USING (
    EXISTS (
      SELECT 1 FROM observation_forms 
      WHERE observation_forms.id = observation_entries.form_id 
      AND observation_forms.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can insert own observation entries" ON observation_entries
  FOR INSERT WITH CHECK (
    EXISTS (
      SELECT 1 FROM observation_forms 
      WHERE observation_forms.id = observation_entries.form_id 
      AND observation_forms.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can update own observation entries" ON observation_entries
  FOR UPDATE USING (
    EXISTS (
      SELECT 1 FROM observation_forms 
      WHERE observation_forms.id = observation_entries.form_id 
      AND observation_forms.author_id = auth.uid()
    )
  );

CREATE POLICY "Users can delete own observation entries" ON observation_entries
  FOR DELETE USING (
    EXISTS (
      SELECT 1 FROM observation_forms 
      WHERE observation_forms.id = observation_entries.form_id 
      AND observation_forms.author_id = auth.uid()
    )
  );

-- Journal Entries policies
CREATE POLICY "Users can view own journal entries" ON journal_entries
  FOR SELECT USING (auth.uid() = author_id);

CREATE POLICY "Users can insert own journal entries" ON journal_entries
  FOR INSERT WITH CHECK (auth.uid() = author_id);

CREATE POLICY "Users can update own journal entries" ON journal_entries
  FOR UPDATE USING (auth.uid() = author_id);

CREATE POLICY "Users can delete own journal entries" ON journal_entries
  FOR DELETE USING (auth.uid() = author_id);
