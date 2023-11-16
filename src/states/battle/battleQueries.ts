import type { With } from 'miniplex'
import { TargetType } from './battlerBundle'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'

export const battlerQuery = ecs.with('battler', 'battleActions', 'actionSelector', 'targetSelector')
export const currentTurnQuery = battlerQuery.with('currentTurn')
export const currentActionQuery = currentTurnQuery.with('currentAction')

export const canHaveTurnQuery = battlerQuery.without('finishedTurn')
export const targetQuery = battlerQuery.with('target', 'position', 'state', 'animationTimer', 'currentHealth', 'maxHealth')
const compareBattlers = (battler: With<Entity, 'currentAction' | 'battler'>) => (target: With<Entity, 'battler'>) => {
	switch (battler.currentAction.target) {
		case TargetType.Self:{
			return battler === target
		}
		case TargetType.AllOthers:
		case TargetType.Others:{
			return battler.battler !== target.battler
		}
		case TargetType.AllSame:
		case TargetType.Same:{
			return battler.battler === target.battler
		}
		case TargetType.Any:
		case TargetType.All: {
			return true
		}
		default:return false
	}
}

export const getPossibleTargets = () => {
	const entity = currentActionQuery.first
	return entity ? Array.from(battlerQuery).filter(compareBattlers(entity)) : []
}