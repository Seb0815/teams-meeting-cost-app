# Meeting Cost App – Microsoft Teams

A Microsoft Teams meeting app that displays the real-time cost of a running meeting.

**Formula:** `Participants × Hourly rate × Elapsed time = Running cost`

## Features

- Live cost counter (updates every second)
- Configurable hourly rate (persisted in local storage)
- Manual participant count input
- Cost per minute and total cost display
- Automatic Teams theming (Light / Dark / High Contrast)
- Runs as a Teams Meeting Side Panel

## Local Development

### Prerequisites

- Node.js 20+
- npm 9+

### Installation

```bash
git clone https://github.com/Seb0815/teams-meeting-cost-app.git
cd teams-meeting-cost-app
npm install
```

### Start the dev server

```bash
npm run dev
```

The app runs at `http://localhost:5173` and can be tested in the browser without a Teams context.

### Create a production build

```bash
npm run build
```

Output is written to `dist/`.

## Install as a Teams App (Sideloading)

### Step 1: Prepare the app package

After building, `dist/teams-manifest.zip` contains the ready-to-upload package:
- `manifest.json`
- `icon-color.png` (192×192)
- `icon-outline.png` (32×32)

### Step 2: Upload to Teams

1. Open Teams → **Apps** → **Manage your apps**
2. Click **Upload a custom app** (or use the [Teams Developer Portal](https://dev.teams.microsoft.com))
3. Select `dist/teams-manifest.zip`
4. Confirm the installation

> **Prerequisite:** Your Teams administrator must allow uploading custom apps (Teams Admin Center → Teams apps → App policies).

### Step 3: Use the app in a meeting

1. Start or join a Teams meeting
2. Click **Apps** in the meeting toolbar
3. Search for **Meeting Cost** and add it
4. The app opens in the **Side Panel**
5. Enter the number of participants and the hourly rate → press **Start**

## Deployment (GitHub Pages)

The project deploys automatically via GitHub Actions to GitHub Pages on every push to `main`.

```
https://seb0815.github.io/teams-meeting-cost-app/
```

## Tech Stack

| Technology | Purpose |
|---|---|
| React + TypeScript | UI framework |
| Vite | Build tool |
| @microsoft/teams-js v2 | Teams SDK (context, theming) |
| @fluentui/react-components v9 | Native Teams UI design |
| GitHub Actions | CI/CD |
| GitHub Pages | Hosting |

## Roadmap (Phase 2)

- [ ] Automatic participant count via Graph API + RSC
- [ ] Different hourly rates per role (Senior / Junior)
- [ ] Meeting cost history
- [ ] Export as PDF / CSV

## License

MIT – see [LICENSE](LICENSE)

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
