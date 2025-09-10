import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';
import { resolve } from 'path';
import lucidePreprocess from "vite-plugin-lucide-preprocess";

export default defineConfig(({ mode }) => {
	// Load env file from root directory
	const env = loadEnv(mode, resolve(process.cwd(), '../../'), '');
	const serverPort = env.SERVER_PORT || env.BACKEND_PORT || '3333';
	const clientPort = env.FRONTEND_PORT || env.CLIENT_PORT || '5173';
	const clientHost = env.FRONTEND_HOST || env.CLIENT_HOST || '0.0.0.0';
	return {
		plugins: [lucidePreprocess(), tailwindcss(), sveltekit()],
		server: {
			port: Number(clientPort) || 5173,
			host: clientHost,
			proxy: {
				// Forward API requests to the backend server in dev
				'/api': {
					target: `http://localhost:${serverPort}`,
					changeOrigin: true,
					secure: false,
				},
			}
		},
		envDir: resolve(process.cwd(), '../../'),
		optimizeDeps: {
			include: ['svelte5-chartjs']
		},
		build: {
			commonjsOptions: {
				include: ['./node_modules/svelte-chartjs/**', './node_modules/chart.js/**']
			}
		}
	};
});
