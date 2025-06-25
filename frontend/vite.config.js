import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'
export default defineConfig({
  plugins: [react()],
  
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  optimizeDeps: {
  include: [
    '@mui/material',
    '@emotion/react',
    '@emotion/styled'
  ]
},
  server: {
    host: '0.0.0.0',
    port: 5173,
    strictPort: true,
    allowedHosts: ['frontend','localhost','qualilead.options.net','dev.qualilead.options.net','preprod.qualilead.options.net'],
    proxy: {
      '/api': 'http://0.0.0.0:8000'
    }
  }
})

