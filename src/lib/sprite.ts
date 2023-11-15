import { Mesh, MeshStandardMaterial, PlaneGeometry, Texture, Vector2 } from 'three'

import { ShaderComposer } from './shaderComposer'
import { type Buffer, getOffscreenBuffer } from '@/utils/buffer'

export class Sprite extends Mesh<PlaneGeometry, MeshStandardMaterial> {
	composer: ShaderComposer
	width: number
	height: number
	#scale = new Vector2(1, 1)
	constructor(texture: Texture) {
		texture.needsUpdate = true
		const composer = new ShaderComposer(texture)
		const geometry = new PlaneGeometry(texture.image.width, texture.image.height)
		composer.render()
		const material = new MeshStandardMaterial({ map: composer.texture, transparent: true })
		super(geometry, material)
		this.position.set(0, 0, 0)
		this.width = texture.image.width
		this.height = texture.image.height
		this.composer = composer
	}

	setTexture(texture: Texture) {
		this.composer.setInitialTexture(texture)
	}

	setScale(x: number, y?: number) {
		this.#scale.x = x
		this.#scale.y = y || x
		this.geometry.scale(this.#scale.x, this.#scale.y, 1)
		return this
	}

	setOpacity(opacity: number) {
		this.material.opacity = opacity
		return this
	}

	anchor(anchorX = 0, anchorY = 0) {
		this.position.x = anchorX * this.scaledDimensions.x
		this.position.y = anchorY * this.scaledDimensions.y
		return this
	}

	get scaledDimensions() {
		return new Vector2(this.width, this.height).multiply(this.#scale)
	}

	set flip(flipped: boolean) {
		this.composer.texture.repeat.x = flipped ? -1 : 1
	}

	get flip() {
		return this.composer.texture.repeat.x === -1
	}

	setSize(width: number, height: number) {
		this.geometry = new PlaneGeometry(width, height)
		return this
	}

	setRenderOrder(nb: number) {
		this.renderOrder = nb
		return this
	}

	static fromBuffer(buffer: Buffer) {
		return new Sprite(new Texture(buffer.canvas))
	}

	static blank(width: number, height: number) {
		return Sprite.fromBuffer(getOffscreenBuffer(width, height))
	}
}