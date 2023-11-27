import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server:{
    proxy:{
      //whenever the api route is '/api' add the target at the begining
      '/api':{
        target: 'http://localhost:3000',//this is where the server is running
        secure: false,
      }
    }
  },
  plugins: [react()],
})
