import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  base: './', // Относительные пути, необходимые для Electron (file://) и Capacitor (iOS)
  server: {
    host: '0.0.0.0', // Доступ со смартфона в локальной сети Wi-Fi
    port: 5173,
  },
})
