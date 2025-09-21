// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwind from '@tailwindcss/vite'

import path from "path"


export default defineConfig({
  plugins: [react(), tailwind()],
  server: {
    proxy: {
      '/api': 'http://localhost:5000'
    }
  }, 
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
