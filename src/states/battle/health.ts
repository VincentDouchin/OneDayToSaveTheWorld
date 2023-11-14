import type { With } from 'miniplex'
import type { Entity } from '@/global/entity'
import { playAnimationChain } from '@/lib/animations'
import { ecs } from '@/global/init'

export const healthBundle = (health: number) => ({ currentHealth: health, maxHealth: health })

export const takeDamage = async (entity: With<Entity, 'currentHealth' | 'maxHealth' | 'state' | 'animationTimer'>, damage: number) => {
	entity.currentHealth = Math.min(Math.max(0, entity.currentHealth + damage), entity.maxHealth)
	if (entity.currentHealth === 0) {
		await playAnimationChain(entity, ['die'])
		ecs.remove(entity)
	}
}