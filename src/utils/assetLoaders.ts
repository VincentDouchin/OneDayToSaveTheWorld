import { Texture } from 'three'
import { getOffscreenBuffer } from './buffer'

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
export const getCharacterName = (path: string) => getFolderName(path).replace('_', '') as characters
type pipeFn<T> = (glob: Record<string, T>) => Promise<Record<string, any>> | Record<string, any>
interface Module { default: string }
export type pipeGlob = pipeFn<Module>
export type Glob<V> = Record<string, Promise<V>>
export class AssetLoader< T = { default: string } > {
	#fn: pipeFn<T> = x => x
	constructor() {}
	pipe<F extends pipeFn<T>>(fn: F) {
		this.#fn = fn
		return this as AssetLoader<Awaited<ReturnType<F>>>
	}

	async load<K extends string>(glob: Record<string, any>) {
		return await this.#fn(glob) as Promise<Record< K, T[keyof T]>>
	}
}
export const loadImage = (path: string): Promise<HTMLImageElement> => new Promise((resolve) => {
	const img = new Image()
	img.src = path
	img.onload = () => resolve(img)
})
export const createAtlas = (dim?: number) => (img: HTMLImageElement | HTMLCanvasElement | OffscreenCanvas) => {
	const dimension = dim ?? img.height
	const result: Array<Array<Texture>> = []
	const spriteNb = img.width / dimension
	for (let y = 0; y < img.height / dimension; y++) {
		result[y] = []
		for (let x = 0; x < spriteNb; x++) {
			const buffer = getOffscreenBuffer(dimension, dimension)
			buffer.drawImage(
				img,
				x * dimension,
				y * dimension,
				dimension,
				dimension,
				0,
				0,
				dimension,
				dimension,
			)
			result[y].push(new Texture(buffer.canvas))
		}
	}
	return result
}
export const joinAtlas = (path: string, atlas: Texture[][]) => {
	const key = getAnimationName(path)
	if (atlas.length === 1) {
		return { [key]: atlas[0] }
	} else {
		return {
			[`${key}-right-down`]: atlas[0],
			[`${key}-left-down`]: atlas[1],
			[`${key}-right-up`]: atlas[2],
			[`${key}-left-up`]: atlas[3],
		}
	}
}