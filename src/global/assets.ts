import type { LDTKMap } from '../levels/LDTKMap'
import { AssetLoader, getFileName, loadImage } from '../utils/assetLoaders'
import { asyncMapValues, mapKeys, mapValues } from '../utils/mapFunctions'

const levelLoader = new AssetLoader<string>()
	.pipe(async (glob) => {
		const levels = mapValues(glob, s => JSON.parse(s) as LDTKMap)
		return mapKeys(levels, getFileName)
	})
const imagesLoader = new AssetLoader()
	.pipe(async (glob) => {
		return asyncMapValues(mapKeys(glob, getFileName), m => loadImage(m.default))
	})
export const loadAssets = async () => {
	return {
		levels: await levelLoader.load<levels>(import.meta.glob('@assets/levels/*.ldtk', { as: 'raw', eager: true })),
		tilesets: await imagesLoader.load<tilesets>(import.meta.glob('@assets/tilesets/*.png', { eager: true })),
	} as const
}