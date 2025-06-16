import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),  // 👈 permet @/components/... et @/assets/...
    },
  },
  server: {
    host: '0.0.0.0',   // ⬅️  Listen on all interfaces
    port: 5173,
    strictPort: true,
    allowedHosts: ['frontend','localhost'],  // 👈 ajouter cette ligne
    proxy: {
      '/api': 'http://0.0.0.0:8000'
    }
  }
})
