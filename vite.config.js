import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
<<<<<<< HEAD
  base: '/viral-pulse-IA/',
=======
  base:"/viral-pulse-IA/",
>>>>>>> 4f5b09378611054200dd7b70b66e810b690ff7d0
  server: {
    port: 5173,
    host: true
  }
})
