import type { Texture } from 'three'
import { Sprite } from './sprite'
import { Timer, time } from './time'
import { assets, ecs } from '@/global/init'
import type { animationName, directionX, directionY } from '@/global/entity'

export const getCurrentAtlas = <C extends characters>(entity: { animations: Record<characterAnimations[C] | animationName<C>, Texture[]>; state: characterAnimations[C]; directionX: directionX; directionY: directionY }) => {
	if (entity.state in entity.animations) {
		return entity.animations[entity.state]
	} else {
		const animation = `${entity.state}-${entity.directionX}-${entity.directionY}` as animationName<C>
		return entity.animations[animation]
	}
}
export const animationBundle = <C extends characters>(character: C, state: characterAnimations[C], directionX: directionX = 'left', directionY: directionY = 'down') => {
	const animations = assets.characters[character] as Record<characterAnimations[C] | animationName<C>, Texture[]>
	const atlas = getCurrentAtlas({ animations, state, directionX, directionY })
	return {
		animations,
		state,
		directionX,
		directionY,
		animationIndex: 0,
		animationTimer: new Timer(100),
		sprite: new Sprite(atlas[0]),
		character,

	} as const
}

const animatedQuery = ecs.with('animations', 'state', 'animationIndex', 'sprite', 'animationTimer', 'directionX', 'directionY')
export const playAnimations = () => {
	for (const entity of animatedQuery) {
		entity.animationTimer.tick(time.delta)
		if (entity.animationTimer.justFinished) {
			const atlas = getCurrentAtlas(entity)
			entity.animationIndex = (entity.animationIndex + 1) % atlas.length
			entity.sprite.setTexture(atlas[entity.animationIndex])
		}
	}
}