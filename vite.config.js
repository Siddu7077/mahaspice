import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    // Added MIME type configuration for JavaScript files
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    },
    // Proxy configuration for handling CORS during development
    proxy: {
      '/ms3': {
        target: 'http://orchid-grasshopper-305065.hostingersite.com',
        changeOrigin: true,  // Crucial for correct proxying
        secure: false        // Allow insecure host (useful for development)
      }
    }
  },
  // Resolve extensions for different file types
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})