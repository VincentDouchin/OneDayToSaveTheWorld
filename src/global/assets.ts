import { Texture } from 'three'
import type { LDTKMap } from '../levels/LDTKMap'
import { AssetLoader, createAtlas, getCharacterName, getFileName, joinAtlas, loadImage } from '../utils/assetLoaders'
import { asyncMapValues, groupByObject, mapKeys, mapValues, reduce } from '../utils/mapFunctions'

const levelLoader = new AssetLoader<string>()
	.pipe(async (glob) => {
		const levels = mapValues(glob, s => JSON.parse(s) as LDTKMap)
		return mapKeys(levels, getFileName)
	})
const imagesLoader = new AssetLoader()
	.pipe(async (glob) => {
		return asyncMapValues(mapKeys(glob, getFileName), m => loadImage(m.default))
	})

const characterLoader = new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	const atlases = mapValues(images, createAtlas(32))

	const characters = groupByObject(atlases, getCharacterName)
	const atlas = mapValues(characters, c => reduce(c, joinAtlas))
	return atlas
})
// const uiLoader = new AssetLoader().pipe(async (glob) => {
// 	const images = await asyncMapValues(glob, m => loadImage(m.default))
// 	return mapKeys(images, getFileName)
// })
const textureLoader = new AssetLoader().pipe(async (glob) => {
	const images = await asyncMapValues(glob, m => loadImage(m.default))
	const textures = mapValues(images, img => new Texture(img))
	return mapKeys(textures, getFileName)
})
export const loadAssets = async () => {
	return {
		characters: await characterLoader.load<characters>(import.meta.glob('@assets/characters/**/*.png', { eager: true })),
		levels: await levelLoader.load<levels>(import.meta.glob('@assets/levels/*.ldtk', { as: 'raw', eager: true })),
		tilesets: await imagesLoader.load<tilesets>(import.meta.glob('@assets/tilesets/*.png', { eager: true })),
		// ui: await uiLoader.load<ui>(import.meta.glob('@assets/ui/*.png', { eager: true })),
		mapIcons: await textureLoader.load<mapIcons>(import.meta.glob('@assets/mapIcons/*.png', { eager: true })),
		battleSprites: await textureLoader.load<battleSprites>(import.meta.glob('@assets/battleSprites/*.png', { eager: true })),
	} as const
}