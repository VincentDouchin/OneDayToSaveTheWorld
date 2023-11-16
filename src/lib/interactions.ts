import type { Texture } from 'three'
import { Sprite } from './sprite'
import { mainCameraQuery, rendererQuery } from '@/global/camera'
import type { Entity } from '@/global/entity'
import { ecs, pointers } from '@/global/init'

export const updatePointers = () => {
	const renderer = rendererQuery.first
	const camera = mainCameraQuery.first

	pointers.update(camera?.camera, renderer?.renderer.domElement)
}

export const changeOnHoverBundle = (normal: Texture, hover: Texture): Entity => ({ changeOnHover: true, atlas: [normal, hover], sprite: new Sprite(normal), animationIndex: 0 })

const changeOnHoverQuery = ecs.with('group', 'animationIndex', 'changeOnHover')
export const changeTextureOnHover = () => {
	for (const pointer of pointers) {
		for (const entity of changeOnHoverQuery) {
			if (pointer.ray.intersectObject(entity.group).length) {
				entity.animationIndex = 1
			} else if (entity.animationIndex === 1) {
				entity.animationIndex = 0
			}
		}
	}
}
const clickableEntitiesQuery = ecs.with('onClick', 'group')
export const clickOnEntity = () => {
	for (const pointer of pointers) {
		for (const entity of clickableEntitiesQuery) {
			if (entity && pointer.pressed && pointer.ray.intersectObject(entity.group).length) {
				entity.onClick()
			}
		}
	}
}