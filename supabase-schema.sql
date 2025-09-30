-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id UUID REFERENCES auth.users(id) ON DELETE CASCADE PRIMARY KEY,
  email TEXT NOT NULL,
  role TEXT DEFAULT 'intern',
  semester_id TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create observation_forms table
CREATE TABLE IF NOT EXISTS observation_forms (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  school TEXT NOT NULL,
  grade TEXT NOT NULL,
  duration INTEGER NOT NULL DEFAULT 45,
  class_comment TEXT,
  semester_id TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create observation_entries table
CREATE TABLE IF NOT EXISTS observation_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  form_id UUID REFERENCES observation_forms(id) ON DELETE CASCADE NOT NULL,
  time TEXT NOT NULL,
  description TEXT NOT NULL,
  comment TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create journal_entries table
CREATE TABLE IF NOT EXISTS journal_entries (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  author_id UUID REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  body TEXT NOT NULL,
  mood INTEGER NOT NULL CHECK (mood >= 1 AND mood <= 5),
  effort INTEGER NOT NULL CHECK (effort >= 1 AND effort <= 5),
  shared_with_tutor BOOLEAN DEFAULT FALSE,
  entry_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_observation_forms_author_id ON observation_forms(author_id);
CREATE INDEX IF NOT EXISTS idx_observation_entries_form_id ON observation_entries(form_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_author_id ON journal_entries(author_id);
CREATE INDEX IF NOT EXISTS idx_journal_entries_entry_date ON journal_entries(entry_date);
