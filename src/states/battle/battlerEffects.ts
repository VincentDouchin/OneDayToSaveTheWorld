import { Tween } from '@tweenjs/tween.js'
import type { With } from 'miniplex'
import { PointLight, Vector3 } from 'three'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { playEffect } from '@/lib/animations'

export type Caster = With<Entity, 'position'>
export interface Effect {
	selfEffects?: () => Promise<any>
	targetEffects?: () => Promise<any>
}
const casterQuery = ecs.with('takingAction', 'currentAction', 'state', 'animationTimer', 'position')
const targetQuery = ecs.with('target', 'position', 'state', 'animationTimer', 'currentHealth', 'maxHealth')
export const bladesEffects: Effect = {
	selfEffects: async () => {
		const entity = casterQuery.first
		if (entity) {
			const light = new PointLight(0xFFFF00, 0, 0, 0.00001)
			const lightEntity = ecs.add({
				parent: entity,
				position: new Vector3(0, 0, 1),
				light,
				tween: new Tween(light).to({ intensity: 3 }, 500),
			})
			await playEffect(entity, ['blades-start', 'blades-middle', 'blades-middle', 'blades-end'])
			ecs.add({ tween: new Tween(light).to({ intensity: 0 }, 500).onComplete(() => {
				ecs.remove(lightEntity)
			}) })
		}
	},
	targetEffects: () => {
		return Promise.all(Array.from(targetQuery).map((target) => {
			return playEffect(target, ['blades-dictum-effect'])
		}))
	},
}