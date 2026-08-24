import adapterCloudflare from '@sveltejs/adapter-cloudflare';
import adapterStatic from '@sveltejs/adapter-static';

/** @type {'static' | 'cloudflare'} */
const deployTarget = process.env.DEPLOY_TARGET === 'static' ? 'static' : 'cloudflare';

/** @type {import('@sveltejs/kit').Config} */
const config = {
	compilerOptions: {
		// Force runes mode for the project, except for libraries. Can be removed in svelte 6.
		runes: ({ filename }) =>
			filename.split(/[/\\]/).includes('node_modules') ? undefined : true
	},
	kit: {
		// Default: Cloudflare Pages/Workers. Set DEPLOY_TARGET=static for GitHub Pages.
		adapter:
			deployTarget === 'static'
				? adapterStatic({
						pages: 'build',
						assets: 'build',
						fallback: '404.html',
						precompress: false,
						strict: true
					})
				: adapterCloudflare({
						config: 'wrangler.jsonc'
					}),
		paths: {
			base: /** @type {'' | `/${string}`} */ (process.env.BASE_PATH ?? '')
		},
		alias: {
			$components: 'src/lib/components'
		}
	}
};

export default config;
