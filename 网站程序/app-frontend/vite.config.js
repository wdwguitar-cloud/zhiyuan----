import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { resolve } from 'node:path'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), tailwindcss()],
  build: {
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        cases: resolve(__dirname, 'cases.html'),
        advisor: resolve(__dirname, 'advisor.html'),
        annual: resolve(__dirname, 'annual.html'),
        partner: resolve(__dirname, 'partner.html'),
        profile: resolve(__dirname, 'profile.html'),
      },
    },
  },
})
