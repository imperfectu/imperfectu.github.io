import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig } from 'vite';

// Kit/adapter options live in svelte.config.js — do not pass options here
// or svelte.config.js will be ignored (SvelteKit ≥2.62).
export default defineConfig({
	plugins: [tailwindcss(), sveltekit()]
});
