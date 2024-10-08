import react from '@vitejs/plugin-react';
import glob from 'fast-glob';
import path from 'path';
import { defineConfig } from 'vite';
import svgr from 'vite-plugin-svgr';

const packages = glob.sync('../packages/*', { onlyDirectories: true }).map(name => name.replace('../packages/', ''));
const alias = packages.reduce(
	(aliases, name) =>
		aliases.concat(
			{
				find: new RegExp(`@ibra-kdbra/editor-${name}/(.*)`),
				replacement: path.resolve(`../packages/${name}/$1`),
			},
			{
				find: `@ibra-kdbra/editor-${name}`,
				replacement: path.resolve(`../packages/${name}/src/index.ts`),
			}
		),
	[
		{
			find: new RegExp(`@ibra-kdbra/editor/(.*)`),
			replacement: path.resolve(`../packages/core/$1`),
		},
		{
			find: '@ibra-kdbra/editor',
			replacement: path.resolve('../packages/core/src/index.ts'),
		},
	]
);

const exclude = [...packages.map(name => `@ibra-kdbra/editor-${name}`), '@ibra-kdbra/editor'];

const ReactCompilerConfig = {
	/* ... */
};

export default defineConfig({
	plugins: [
		react({
			babel: {
				plugins: [['babel-plugin-react-compiler', ReactCompilerConfig]],
			},
		}),
		svgr(),
	],
	resolve: {
		alias,
	},
	optimizeDeps: {
		exclude,
	},
});
