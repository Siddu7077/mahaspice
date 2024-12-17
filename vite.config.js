import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'  // https://vite.dev/config/

export default defineConfig({
  plugins: [react()],
  server: {
    // Added MIME type configuration for JavaScript files
    mimeTypes: {
      'application/javascript': ['js', 'jsx']
    }
  },
  // Resolve extensions for different file types
  resolve: {
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }
})
