import { Vector3 } from 'three'
import { Sprite } from './sprite'
import { assets, ecs } from '@/global/init'
import { getCurrentAtlas } from '@/lib/animations'

const shadowQuery = ecs.with('shadow', 'character', 'state', 'directionX', 'directionY', 'animationIndex', 'position', 'group')
const withShadowEntityQuery = shadowQuery.with('shadowEntity')
export const spawnShadow = () => shadowQuery.onEntityAdded.subscribe((entity) => {
	const state = `${entity.state}-shadow`
	const animations = assets.shadows[entity.character]
	const atlas = getCurrentAtlas({ animations, state, directionX: entity.directionX, directionY: entity.directionY })
	const shadow = ecs.add({
		parent: entity,
		animations,
		atlas,
		state,
		directionX: entity.directionX,
		directionY: entity.directionY,
		animationIndex: 0,
		sprite: new Sprite(atlas[0]).setOpacity(0.5),
		position: new Vector3(),
	})
	ecs.addComponent(entity, 'shadowEntity', shadow)
})

export const updateShadows = () => {
	for (const { shadowEntity, state, directionX, directionY, animationIndex } of withShadowEntityQuery) {
		shadowEntity.directionX = directionX
		shadowEntity.directionY = directionY
		shadowEntity.state = `${state}-shadow`
		shadowEntity.animationIndex = animationIndex
		shadowEntity.sprite?.composer.render()
	}
}