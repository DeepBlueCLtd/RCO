import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import preval from 'vite-plugin-babel-macros'

// https://vitejs.dev/config/
export default ({
	plugins: [react(), preval()],
	base: '/RCO/'
});
