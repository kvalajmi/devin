import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: false, // Allow fallback to other ports
    open: false // Don't open browser automatically when running with Electron
  }
})
