import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterStatic from '@sveltejs/adapter-static';
import tailwindcss from '@tailwindcss/vite';
import { sveltekit } from '@sveltejs/kit/vite';
import { defineConfig, loadEnv } from 'vite';

/** Staging = GitHub Pages (static). Production = Cloudflare Pages when DEPLOY_TARGET=cloudflare */
const env = loadEnv(process.env.MODE ?? 'production', process.cwd(), '');
const deployTarget = (process.env.DEPLOY_TARGET ?? env.DEPLOY_TARGET) === 'cloudflare' ? 'cloudflare' : 'static';

const adapter =
	deployTarget === 'cloudflare'
		? adapterCloudflare()
		: adapterStatic({
				pages: 'build',
				assets: 'build',
				fallback: '404.html',
				precompress: false,
				strict: true
			});

export default defineConfig({
	plugins: [
		tailwindcss(),
		sveltekit({
			compilerOptions: {
				// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
				runes: ({ filename }) =>
					filename.split(/[/\\]/).includes('node_modules') ? undefined : true
			},
			adapter,
			paths: {
				base: ((process.env.BASE_PATH ?? env.BASE_PATH ?? '') as '' | `/${string}`)
			}
		})
	]
});
