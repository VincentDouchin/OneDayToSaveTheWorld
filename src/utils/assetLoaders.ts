export const getFileName = (path: string) => {
	return	path.split(/[./]/g).at(-2) ?? ''
}
export const getFolderName = (path: string) => {
	return	path.split(/[./]/g).at(-3) ?? ''
}
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