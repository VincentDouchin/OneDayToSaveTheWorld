import type { With } from 'miniplex'
import type { Texture } from 'three'
import { Sprite } from './sprite'
import { Timer } from './time'
import { assets, ecs, time } from '@/global/init'
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
		atlas,
		state,
		directionX,
		directionY,
		animationIndex: 0,
		animationTimer: new Timer(100),
		sprite: new Sprite(atlas[0]),
		character,
	} as const satisfies Entity
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
	const effect = ecs.add({ ...characterAnimationBundle('battleEffects', animations[0], entity.directionX, entity.directionY), position: entity.position, forward: true, ...components })
	await playAnimationChain(effect, animations)
	ecs.remove(effect)
}

const animatedQuery = ecs.with('state', 'animationIndex', 'sprite', 'atlas')

export const tickAnimations = () => {
	for (const entity of animatedQuery) {
		if (entity.animationTimer) {
			entity.animationTimer.delay = getAnimationDelay(entity.state, entity.character)
			entity.animationTimer.tick(time.delta)

			if (entity.animationTimer.justFinished) {
				if (entity.animationIndex === entity.atlas.length - 1) {
					if (entity.onAnimationFinished) {
						entity.onAnimationFinished()
					}
				}

				entity.animationIndex = (entity.animationIndex + 1) % entity.atlas.length
			}
		}
	}
}
const atlasStateQuery = ecs.with('animations', 'state', 'directionX', 'directionY', 'atlas', 'animationIndex')

export const setCurrentAtlas = () => {
	for (const entity of atlasStateQuery) {
		if (entity.atlas !== getCurrentAtlas(entity)) {
			entity.atlas = getCurrentAtlas(entity)
			entity.animationIndex = 0
		}
	}
}
const atlasQuery = ecs.with('sprite', 'atlas', 'animationIndex')
export const setAtlasTexture = () => {
	for (const { sprite, atlas, animationIndex } of atlasQuery) {
		sprite.setTexture(atlas[animationIndex])
	}
}