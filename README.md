# Praktikum App

Eine Next.js 14 App für die Verwaltung von Beobachtungsbögen und Journal-Einträgen während des Praktikums.

## Features

- **Beobachtungsbögen**: Dynamische Tabellen mit Zeit, Beschreibung und Kommentaren
- **Journal**: Persönliche Einträge mit Stimmungs- und Anstrengungsskala
- **Supabase Integration**: Sichere Authentifizierung und Datenverwaltung
- **Responsive Design**: Mobilfreundliche Benutzeroberfläche
- **TypeScript**: Vollständig typisiert für bessere Entwicklererfahrung

## Technologie-Stack

- Next.js 14 (App Router)
- TypeScript
- Tailwind CSS
- Supabase
- React 19

## Setup

1. **Dependencies installieren:**
   ```bash
   npm install
   ```

2. **Environment Variables konfigurieren:**
   Erstelle eine `.env.local` Datei im Root-Verzeichnis:
   ```env
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
   ```

3. **Development Server starten:**
   ```bash
   npm run dev
   ```

4. **App öffnen:**
   Öffne [http://localhost:3000](http://localhost:3000) in deinem Browser.

## Projektstruktur

```
src/
├── app/                    # Next.js App Router Seiten
│   ├── dashboard/          # Dashboard mit Kacheln
│   ├── login/             # Anmelde-/Registrierungsseite
│   ├── observations/       # Beobachtungsbögen
│   │   ├── new/           # Neue Beobachtung erstellen
│   │   └── [id]/          # Beobachtung anzeigen
│   ├── journal/           # Journal-Einträge
│   │   ├── new/           # Neuen Eintrag erstellen
│   │   └── [id]/          # Eintrag anzeigen
│   └── layout.tsx         # Root Layout
├── components/             # Wiederverwendbare Komponenten
│   ├── ObservationTable.tsx  # Dynamische Beobachtungstabelle
│   └── JournalEditor.tsx     # Journal-Editor mit Slidern
└── lib/
    └── supabase.ts        # Supabase Client Konfiguration
```

## Komponenten

### ObservationTable
- Dynamische Tabelle mit hinzufügen/entfernen von Zeilen
- Spalten: Zeit (min), Was ist passiert?, Kommentar
- Read-only Modus für Detailansichten

### JournalEditor
- Textarea für Inhalt
- Slider für Stimmung (1-5)
- Slider für Anstrengung (1-5)
- Checkbox "Mit Betreuer:in teilen"
- Read-only Modus für Detailansichten

## Supabase Integration

Die App ist vorbereitet für Supabase CRUD-Operationen. Aktuell werden Mock-Daten verwendet, aber die Struktur ist so aufgebaut, dass Supabase-Integration einfach hinzugefügt werden kann.

### Geplante Supabase Tabellen:

**observations**
- id (uuid, primary key)
- title (text)
- user_id (uuid, foreign key)
- rows (jsonb) - Array der ObservationRow Objekte
- created_at (timestamp)
- updated_at (timestamp)

**journal_entries**
- id (uuid, primary key)
- content (text)
- mood (integer, 1-5)
- effort (integer, 1-5)
- share_with_supervisor (boolean)
- user_id (uuid, foreign key)
- created_at (timestamp)
- updated_at (timestamp)

## Development

```bash
# Development Server
npm run dev

# Build für Production
npm run build

# Production Server
npm start

# Linting
npm run lint
```

## Deployment

Die App kann auf Vercel, Netlify oder anderen Next.js-kompatiblen Plattformen deployed werden. Vergiss nicht, die Environment Variables in deinem Deployment-Service zu konfigurieren.
