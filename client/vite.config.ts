import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

export default defineConfig({
	plugins: [tailwindcss(), sveltekit()],
	optimizeDeps: {
		include: ['svelte-chartjs'],
	},
	build: {
		commonjsOptions: {
			include: ['./node_modules/svelte-chartjs/**', './node_modules/chart.js/**'],
		},
	},
});
