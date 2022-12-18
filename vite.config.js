import { sveltekit } from '@sveltejs/kit/vite';
import { websocketServer } from './webscoketPluginVite';

/** @type {import('vite').UserConfig} */
const config = {
	server: {
		port: 3000
	},
	preview: {
		port: 3000
	},
	plugins: [sveltekit(), websocketServer]
};

export default config;
