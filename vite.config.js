import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

// https://vite.dev/config/
export default defineConfig({
  base: './', // Ensures relative assets so the app can deploy seamlessly on GitHub Pages, Vercel, Netlify, or any subpath
  plugins: [
    react(),
    tailwindcss(),
  ],
})
