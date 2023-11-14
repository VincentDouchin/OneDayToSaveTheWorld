import type { With } from 'miniplex'
import type { Texture } from 'three'
import { Sprite } from './sprite'
import { Timer, time } from './time'
import { assets, ecs } from '@/global/init'
import type { Entity, animationName, directionX, directionY } from '@/global/entity'
import { animationDelay } from '@/constants/animationDelay'

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
const getAnimationDelay = <C extends characters>(character: C, state: characterAnimations[C]) => {
	const delayGroup = animationDelay[character] || animationDelay.default
	return delayGroup?.[state] ?? delayGroup?.default ?? 100
}

export const playAnimationChain = <C extends characters>(entity: With<Entity, 'state' | 'animationTimer'>, animations: characterAnimations[C][], reset = true) => {
	const initialState = entity.state
	entity.animationIndex = 0
	entity.state = animations[0]
	let i = 1
	const fn = (res: () => void) => () => {
		i++
		if (i < animations.length) {
			entity.animationIndex = 0
			entity.state = animations[i]
		} else {
			ecs.removeComponent(entity, 'onAnimationFinished')
			if (reset) {
				entity.state = initialState
			}
			res()
		}
	}
	return new Promise<void>((resolve) => {
		ecs.addComponent(entity, 'onAnimationFinished', fn(resolve))
	 })
}
export const playEffect = async (entity: With<Entity, 'position'>, animations: characterAnimations['battleEffects'][], components?: Entity) => {
	const effect = ecs.add({ ...animationBundle('battleEffects', animations[0], entity.directionX, entity.directionY), position: entity.position, forward: true, size: entity.size, ...components })
	await playAnimationChain(effect, animations)
	ecs.remove(effect)
}

const animatedQuery = ecs.with('animations', 'state', 'animationIndex', 'sprite', 'animationTimer', 'directionX', 'directionY', 'character')
export const playAnimations = () => {
	for (const entity of animatedQuery) {
		entity.animationTimer.delay = getAnimationDelay(entity.character, entity.state)
		entity.animationTimer.tick(time.delta)
		if (entity.animationTimer.justFinished) {
			const atlas = getCurrentAtlas(entity)
			if (entity.animationIndex === atlas.length - 1) {
				if (entity.onAnimationFinished) {
					entity.onAnimationFinished()
				}
			}
			const newAtlas = getCurrentAtlas(entity)
			entity.animationIndex = (entity.animationIndex + 1) % newAtlas.length
			entity.sprite.setTexture(newAtlas[entity.animationIndex])
		}
	}
}