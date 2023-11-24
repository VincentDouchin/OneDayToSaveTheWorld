import { exec } from 'node:child_process'
import { readdir, writeFile } from 'node:fs/promises'

import path, { dirname } from 'node:path'
import process from 'node:process'
import type { PluginOption } from 'vite'

export const getFileName = (path: string) => {
	return	path.split(/[./]/g).at(-2) ?? ''
}
export const getFolderName = (path: string) => {
	return	path.split(/[./]/g).at(-3) ?? ''
}
export const getAnimationName = (path: string) => {
	const parts = getFileName(path).split(/(?=[A-Z])/).map(s => s.toLowerCase())
	parts.shift()
	return parts.join('-')
}
export const getSoundName = (path: string) => {
	const parts = getFileName(path).split(/_/).map(s => s.toLowerCase())
	parts.shift()
	return parts.join('-')
}

export default function generateAssetNames(): PluginOption {
	const launchScript = async (filePath?: string) => {
		if (!filePath || (filePath.includes('assets\\'))) {
			const folders: Record<string, string[]> = {}
			const map = [
				'characters',
				'sounds',
				'battleEffects',
			]

			const assetsDir = await readdir('./assets', { withFileTypes: true })
			const inner: Record<string, Record<string, string[]>> = {}
			for (const dir of assetsDir) {
				if (dir.isDirectory() && dir.name[0] !== '_') {
					console.log(assetsDir)
					const files = (await readdir(`./assets/${dir.name}`))
					if (map.includes(dir.name)) {
						inner[dir.name] = {}
						for (const characterFolder of files) {
							inner[dir.name][characterFolder] = []
							const files = (await readdir(`./assets/${dir.name}/${characterFolder}`, { withFileTypes: true }))
							for (const file of files.filter(f => f.isFile())) {
								inner[dir.name][characterFolder].push(getAnimationName(file.name))
							}
						}
					} else {
						const fileNames = files.map(x => x.split('.')[0])

						folders[dir.name] = fileNames
					}
				}
			}
			let result = ''

			for (const [folder, files] of Object.entries(folders)) {
				result += `type ${folder} = ${files.map(x => `'${x}'`).join(' | ')}\n`
			}
			for (const [typename, innerfiles] of Object.entries(inner)) {
				result += `interface ${typename} {\n`
				for (const [folder, files] of Object.entries(innerfiles)) {
					result += `${folder} : ${files.map(x => `\`${x}\``).join(` | `)}\n`
				}
				result += `}
				`
			}

			await writeFile(path.join(process.cwd(), 'assets', 'assets.d.ts'), result)
			exec('eslint assets/assets.d.ts --fix')
			console.log('regenerated asset names')
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