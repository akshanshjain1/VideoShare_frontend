import { build, defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv'
dotenv.config()

export default defineConfig({
  
  server:{
    proxy:{
      "/api": {
        target: process.env.VITE_BACKEND_URL,
        changeOrigin: true, 
        
         
      }
    }
  },
  plugins: [react()],
},

)
