import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true, // Tüm network interface'lerde dinle
    open: true, // Otomatik tarayıcıda aç
    strictPort: false // Port meşgulse başka port dene
  }
})
