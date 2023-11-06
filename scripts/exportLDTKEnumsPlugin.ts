import path from 'node:path'
import process from 'node:process'

import { writeFile } from 'node:fs/promises'
import { exec } from 'node:child_process'
import type { PluginOption } from 'vite'
import LDTKEnums from './../src/constants/exports/LDTKEnums.json'

export default function exportLDTKEnums(): PluginOption {
	const launchScript = async (filePath?: string) => {
		if (!filePath || filePath?.includes('LDTKEnums.json')) {
			writeFile(path.join(process.cwd(), 'src', 'constants', 'exports', 'LDTKEnums.ts'), `
			const LDTKEnums = ${JSON.stringify(LDTKEnums)} as const
			export default LDTKEnums
			`)
			exec('npx eslint ./src/constants/exports/LDTKEnums.ts --fix')
		}
	}
	launchScript()
	return {
		name: 'watch-assets',
		apply: 'serve',
		configureServer(server) {
			server.watcher.on('add', launchScript)
			server.watcher.on('unlink', launchScript)
		},

	}
}