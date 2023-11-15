import type { With } from 'miniplex'
import type { Texture } from 'three'
import { Sprite } from './sprite'
import { Timer, time } from './time'
import { assets, ecs } from '@/global/init'
import type { Entity, animationName, directionX, directionY, state } from '@/global/entity'
import { animationDelay } from '@/constants/animationDelay'

export const getCurrentAtlas = <C extends characters>(entity: { animations: Record<string, Texture[]>; state: state<C>; directionX: directionX; directionY: directionY }) => {
	if (entity.state in entity.animations) {
		return entity.animations[entity.state]
	} else {
		const animation = `${entity.state}-${entity.directionX}-${entity.directionY}` as animationName<C>
		return entity.animations[animation]
	}
}
const animationBundle = (source: typeof assets.characters | typeof assets.shadows) => <C extends characters>(character: C, state: state<C>, directionX: directionX = 'left', directionY: directionY = 'down') => {
	const animations = source[character] as Record<string, Texture[]>
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
export const characterAnimationBundle = animationBundle(assets.characters)
export const shadowAnimationBundle = animationBundle(assets.shadows)
const getAnimationDelay = <C extends characters>(state: state<C>, character?: C) => {
	const delayGroup = character && animationDelay[character] || animationDelay.default
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
	const effect = ecs.add({ ...characterAnimationBundle('battleEffects', animations[0], entity.directionX, entity.directionY), position: entity.position, forward: true, size: entity.size, ...components })
	await playAnimationChain(effect, animations)
	ecs.remove(effect)
}

const animatedQuery = ecs.with('animations', 'state', 'animationIndex', 'sprite', 'directionX', 'directionY')

export const playAnimations = () => {
	for (const entity of animatedQuery) {
		if (entity.animationTimer) {
			entity.animationTimer.delay = getAnimationDelay(entity.state, entity.character)
			entity.animationTimer.tick(time.delta)

			if (entity.animationTimer.justFinished) {
				const atlas = getCurrentAtlas(entity)
				if (entity.animationIndex === atlas.length - 1) {
					if (entity.onAnimationFinished) {
						entity.onAnimationFinished()
					}
				}
				const newAtlas = getCurrentAtlas(entity)
				if (entity.sprite.composer.initialTarget.texture === newAtlas[entity.animationIndex]) {
					entity.animationIndex = (entity.animationIndex + 1) % newAtlas.length
				} else {
					entity.animationIndex = 0
				}
			}
		}
		const newAtlas = getCurrentAtlas(entity)
		const normalsAtlas = getCurrentAtlas({ ...entity, animations: assets.normals.paladin })
		if (normalsAtlas) {
			entity.sprite.material.normalMap = normalsAtlas[entity.animationIndex]
			entity.sprite.material.needsUpdate = true
		}
		entity.sprite.setTexture(newAtlas[entity.animationIndex])
	}
}