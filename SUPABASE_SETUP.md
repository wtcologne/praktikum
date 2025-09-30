# Supabase Setup Anleitung

## 1. Tabellen erstellen

Gehe zu deinem Supabase Dashboard und führe das SQL-Schema aus:

1. Öffne dein Supabase Projekt
2. Gehe zu "SQL Editor" im linken Menü
3. Kopiere den Inhalt von `supabase-schema.sql` und führe ihn aus
4. Kopiere den Inhalt von `supabase-policies.sql` und führe ihn aus

## 2. Umgebungsvariablen prüfen

Stelle sicher, dass deine `.env.local` Datei korrekt konfiguriert ist:

```env
NEXT_PUBLIC_SUPABASE_URL=https://ahfpndkghzbujyaixqxw.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFoZnBuZGtnaHpidWp5YWl4cXh3Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTkxMzgwMTAsImV4cCI6MjA3NDcxNDAxMH0.C-5ieG4XWNMsNWqxWw2bAUVRt_Bjkzj-7F1K-RN0Xy4
NEXT_PUBLIC_APP_NAME=Praktikumsjournal
```

## 3. RLS Policies

Die RLS (Row Level Security) Policies sind so konfiguriert, dass:

- **Profiles**: Nutzer können nur ihr eigenes Profil sehen/bearbeiten
- **Observation Forms**: Nutzer können nur ihre eigenen Beobachtungsbögen verwalten
- **Observation Entries**: Nutzer können nur Einträge zu ihren eigenen Formularen verwalten
- **Journal Entries**: Nutzer können nur ihre eigenen Journal-Einträge verwalten

## 4. Testen

Nach dem Ausführen der SQL-Scripts sollte die App wieder funktionieren:

1. Starte den Development Server neu: `npm run dev`
2. Versuche dich anzumelden
3. Erstelle einen neuen Beobachtungsbogen
4. Erstelle einen neuen Journal-Eintrag

## 5. Troubleshooting

Falls es immer noch Probleme gibt:

1. Prüfe die Browser-Konsole auf Fehler
2. Prüfe das Terminal auf weitere Fehlermeldungen
3. Stelle sicher, dass alle Tabellen korrekt erstellt wurden
4. Prüfe, ob die RLS Policies aktiviert sind
