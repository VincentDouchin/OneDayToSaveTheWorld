import { Howl } from 'howler'
import { Texture } from 'three'
import type { LDTKMap } from '../levels/LDTKMap'
import type { defaultGlob } from '../utils/assetLoaders'
import { AssetLoader, createAtlas, getFileName, getFolderName, getNameAt, getSoundName, joinAtlas, loadImage } from '../utils/assetLoaders'
import { asyncMapValues, entries, groupByObject, mapKeys, mapValues, reduce } from '../utils/mapFunctions'
import { getScreenBuffer } from '@/utils/buffer'

// ! Images
const imagesLoader = new AssetLoader()
	.pipe(async (glob) => {
		return asyncMapValues(mapKeys(glob, getFileName), m => loadImage(m.default))
	})
// ! Textures
const textureLoader = new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	const textures = mapValues(images, img => new Texture(img))
	return mapKeys(textures, getFileName)
})
// ! Levels
const levelLoader = new AssetLoader<string>()
	.pipe(async (glob) => {
		const levels = mapValues(glob, s => JSON.parse(s) as LDTKMap)
		return mapKeys(levels, getFileName)
	})
// ! Characters
const characterLoader = (level: number) => new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	const atlases = mapValues(images, createAtlas(32))

	const characters = groupByObject(atlases, getNameAt(level))
	const atlas = mapValues(characters, c => reduce(c, joinAtlas))
	return atlas
})
// ! Ui
const uiLoader = new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	return mapKeys(images, getFileName)
})
// ! Hero icons
const heroIconsNames = [
	['bard', 'attack1', 'attack2', 'attack3', 'attack4'],
	['cleric', 'attack1', 'attack2', 'attack3', 'attack4'],
	['paladin', 'paladinAttack1', 'paladinAttack2', 'paladinAttack3', 'paladinAttack4'],
] as const
const heroIconsLoader = new AssetLoader()
	.pipe(async (glob) => {
		const res: Record<string, HTMLImageElement> = {}
		const img = await loadImage(Object.values(glob)[0].default)
		for (let y = 0; y < 3; y++) {
			for (let x = 0; x < 5; x++) {
				const buffer = getScreenBuffer(8, 8)
				buffer.drawImage(img, x * 16 + 8, y * 16 + 8, 8, 8, 0, 0, 8, 8)
				const icon = new Image()
				icon.src = buffer.canvas.toDataURL()
				res[heroIconsNames[y][x]] = icon
			}
		}
		return res
	})
// ! Fonts
const fontLoader = new AssetLoader()
	.pipe(async (glob) => {
		const fonts = mapKeys(glob, getFileName)
		for (const [key, m] of entries(fonts)) {
			const [name, weight] = key.split('-')
			const font = new FontFace(name, `url(${m.default})`, { weight: weight ?? 'normal' })
			await font.load()
			document.fonts.add(font)
		}
	})
// ! Sounds
const soundLoader = async (glob: defaultGlob) => {
	const howls = mapValues(glob, m => new Howl({ src: m.default }))
	const folders = groupByObject(howls, k => getFolderName(k))
	return mapValues(folders, files => mapKeys(files, getSoundName)) as { [c in keyof soundEffects]: { [k in soundEffects[c]]: Howl } }
}
const uiSoundLoader = new AssetLoader().pipe((glob) => {
	return mapKeys(mapValues(glob, m => new Howl({ src: m.default })), getFileName)
})
const spriteLoader = new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	const textures = mapValues(images, img => new Texture(img))
	return mapKeys(textures, getFileName)
})
export const loadAssets = async () => {
	return {
		characters: await characterLoader(3).load<characters>(import.meta.glob('@assets/characters/*/*.png', { eager: true })),
		shadows: await characterLoader(4).load<characters>(import.meta.glob('@assets/characters/*/Shadows/*.png', { eager: true })),
		normals: await characterLoader(4).load<characters>(import.meta.glob('@assets/characters/*/Normals/*.png', { eager: true })),
		levels: await levelLoader.load<levels>(import.meta.glob('@assets/levels/*.ldtk', { as: 'raw', eager: true })),
		sounds: await soundLoader(import.meta.glob('@assets/sounds/**/*.*', { eager: true })),
		tilesets: await imagesLoader.load<tilesets>(import.meta.glob('@assets/tilesets/*.png', { eager: true })),
		// ui: await uiLoader.load<ui>(import.meta.glob('@assets/ui/*.png', { eager: true })),
		mapIcons: await textureLoader.load<mapIcons>(import.meta.glob('@assets/mapIcons/*.png', { eager: true })),
		battleSprites: await textureLoader.load<battleSprites>(import.meta.glob('@assets/battleSprites/*.png', { eager: true })),
		ui: await uiLoader.load<ui>(import.meta.glob('@assets/ui/*.png', { eager: true })),
		heroIcons: await heroIconsLoader.load<typeof heroIconsNames[number][number]>(import.meta.glob('@assets/_singles/TrueHeroes2Icons.png', { eager: true })),
		fonts: await fontLoader.load<fonts>(import.meta.glob('@assets/fonts/*.*', { eager: true })),
		uiSounds: await uiSoundLoader.load<uiSounds>(import.meta.glob('@assets/uiSounds/*.*', { eager: true })),
		sprites: await spriteLoader.load<sprites>(import.meta.glob('@assets/sprites/*.png', { eager: true })),
	} as const
}