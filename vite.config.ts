import react from '@vitejs/plugin-react'
import preval from 'vite-plugin-babel-macros'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default {
  plugins: [
    react(),
    preval(),
    EnvironmentPlugin({
      VITE_KEY: null
    })
  ],
  base: '/RCO/'
}
