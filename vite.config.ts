import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/v1': {
        target: 'http://139.190.96.203:8093',
        changeOrigin: true,
        secure: false,
      },
    },
  },
})

