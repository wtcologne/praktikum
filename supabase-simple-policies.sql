-- Temporär alle RLS Policies löschen
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

-- Einfache Policies erstellen
CREATE POLICY "Enable all for authenticated users" ON profiles
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON observation_forms
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON observation_entries
  FOR ALL USING (auth.role() = 'authenticated');

CREATE POLICY "Enable all for authenticated users" ON journal_entries
  FOR ALL USING (auth.role() = 'authenticated');
