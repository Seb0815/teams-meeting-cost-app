# Meeting Cost App – Microsoft Teams

Eine Microsoft Teams Meeting-App, die live die realen Kosten eines laufenden Meetings anzeigt.

**Formel:** `Anzahl Teilnehmer × Stundensatz × verstrichene Zeit = laufende Kosten`

![Teams Side Panel](https://seb0815.github.io/teams-meeting-cost-app/)

## Features

- Live-Kostenzähler (aktualisiert jede Sekunde)
- Konfigurierbarer Stundensatz (wird im Browser gespeichert)
- Manuelle Eingabe der Teilnehmerzahl
- Anzeige von Kosten pro Minute und Gesamtkosten
- Automatisches Teams-Theming (Hell / Dunkel / Hoher Kontrast)
- Läuft als Teams Meeting Side Panel

## Lokale Entwicklung

### Voraussetzungen

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/Seb0815/teams-meeting-cost-app.git
cd teams-meeting-cost-app
npm install
```

### Dev-Server starten

```bash
npm run dev
```

Die App läuft unter `http://localhost:5173` und kann dort im Browser getestet werden (ohne Teams-Kontext, aber mit vollem UI).

### Build erstellen

```bash
npm run build
```

Das Build-Ergebnis liegt in `dist/`.

## Als Teams-App installieren (Sideloading)

### Schritt 1: App-Manifest vorbereiten

Nach dem Build enthält `dist/teams-manifest.zip` das fertige Paket mit:
- `manifest.json`
- `icon-color.png` (192×192)
- `icon-outline.png` (32×32)

### Schritt 2: App in Teams hochladen

1. Teams öffnen → **Apps** → **App verwalten**
2. **Benutzerdefinierte App hochladen** (oder über [Teams Developer Portal](https://dev.teams.microsoft.com))
3. `dist/teams-manifest.zip` auswählen
4. App bestätigen

> **Voraussetzung:** Dein Teams-Administrator muss das Sideloading/Upload von benutzerdefinierten Apps erlauben (Teams Admin Center → Teams-Apps → App-Richtlinien).

### Schritt 3: App in einem Meeting nutzen

1. Ein Teams-Meeting starten oder beitreten
2. Oben in der Meeting-Leiste auf **Apps** klicken
3. **Meeting Cost** suchen und hinzufügen
4. Die App öffnet sich im **Side Panel**
5. Anzahl Teilnehmer und Stundensatz eingeben → **Start** drücken

## Deployment (GitHub Pages)

Das Projekt deployed automatisch über GitHub Actions auf GitHub Pages.

```
https://seb0815.github.io/teams-meeting-cost-app/
```

Jeder Push auf `main` triggert einen neuen Deploy.

## Tech Stack

| Technologie | Zweck |
|---|---|
| React + TypeScript | UI-Framework |
| Vite | Build-Tool |
| @microsoft/teams-js v2 | Teams SDK (Kontext, Theming) |
| @fluentui/react-components v9 | Teams-natives UI-Design |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

## Roadmap (Phase 2)

- [ ] Automatische Teilnehmerzählung via Graph API + RSC
- [ ] Verschiedene Stundensätze pro Rolle (Senior/Junior)
- [ ] Meeting-Kostenhistorie
- [ ] Export als PDF/CSV

## Lizenz

MIT – siehe [LICENSE](LICENSE)

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend updating the configuration to enable type-aware lint rules:

```js
export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...

      // Remove tseslint.configs.recommended and replace with this
      tseslint.configs.recommendedTypeChecked,
      // Alternatively, use this for stricter rules
      tseslint.configs.strictTypeChecked,
      // Optionally, add this for stylistic rules
      tseslint.configs.stylisticTypeChecked,

      // Other configs...
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```

You can also install [eslint-plugin-react-x](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-x) and [eslint-plugin-react-dom](https://github.com/Rel1cx/eslint-react/tree/main/packages/plugins/eslint-plugin-react-dom) for React-specific lint rules:

```js
// eslint.config.js
import reactX from 'eslint-plugin-react-x'
import reactDom from 'eslint-plugin-react-dom'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{ts,tsx}'],
    extends: [
      // Other configs...
      // Enable lint rules for React
      reactX.configs['recommended-typescript'],
      // Enable lint rules for React DOM
      reactDom.configs.recommended,
    ],
    languageOptions: {
      parserOptions: {
        project: ['./tsconfig.node.json', './tsconfig.app.json'],
        tsconfigRootDir: import.meta.dirname,
      },
      // other options...
    },
  },
])
```
