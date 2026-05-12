import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
// base wird für GitHub Pages benötigt: /REPO_NAME/
// Lokal läuft es ohne base, in CI wird BASE_URL gesetzt
export default defineConfig({
  plugins: [react()],
  base: process.env.BASE_URL ?? '/',
})

