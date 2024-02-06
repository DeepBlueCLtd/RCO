import react from '@vitejs/plugin-react'
import preval from 'vite-plugin-babel-macros'
import EnvironmentPlugin from 'vite-plugin-environment'

// https://vitejs.dev/config/
export default {
  plugins: [
    react(),
    preval(),
    EnvironmentPlugin({
      VITE_KEY: null,
      VITE_APP_VERSION: null,
      VITE_DATA_VERSION: null,
      MOCK: null,
      VAL_TEST: null
    })
  ],
  base: './'
}
