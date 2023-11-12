import type { With } from 'miniplex'
import { ActionSelector, TargetSelector, TargetType } from './battlerBundle'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'

const battlerQuery = ecs.with('battler', 'battleActions', 'actionSelector', 'targetSelector')
const currentTurnQuery = battlerQuery.with('currentTurn')
const currentActionQuery = currentTurnQuery.with('currentAction')

const canHaveTurnQuery = battlerQuery.without('finishedTurn')
const targetQuery = battlerQuery.with('target')

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

const getPossibleTargets = (entity: With<Entity, 'currentAction' | 'battler'>) => {
	return Array.from(battlerQuery).filter(compareBattlers(entity))
}

const selectBattler = () => {
	if (canHaveTurnQuery.size > 0) {
		const [entity] = canHaveTurnQuery
		addTag(entity, 'currentTurn')
	}
}
const battlerMenuQuery = ecs.with('battlerMenu', 'menuInputMap')
const targetSelectorMenuQuery = ecs.with('targetSelectorMenu')

const selectAction = () => {
	const [entity] = currentTurnQuery
	switch (entity.actionSelector) {
		case ActionSelector.PlayerMenu:{
			 battlerMenuQuery.first && addTag(battlerMenuQuery.first, 'menu')
		};break
		case ActionSelector.EnemyAuto:{
			ecs.addComponent(entity, 'currentAction', entity.battleActions[0])
		};break
	}
}
const takeAction = () => {

}
const selectTargets = () => {
	const [entity] = currentActionQuery
	const targets = getPossibleTargets(entity)
	switch (entity.targetSelector) {
		case TargetSelector.PlayerTargetMenu:{
			// remove selected action
			const [menu] = battlerMenuQuery
			if (menu.menuInputMap.get('cancel').justPressed) {
				ecs.removeComponent(entity, 'currentAction')
			} else {
				targetSelectorMenuQuery.first && addTag(targetSelectorMenuQuery.first, 'menu')
			}
		};break
		case TargetSelector.EnemyAuto:{
			for (let i = 0; i < entity.currentAction.targetAmount; i++) {
				addTag(targets[i], 'target')
			}
			takeAction()
		}
	}
}

export const battle = () => {
	if (currentTurnQuery.size === 0) {
		selectBattler()
	} else {
		for (const entity of currentTurnQuery) {
			if (!entity.currentAction) {
				selectAction()
			} else if (targetQuery.size === 0) {
				selectTargets()
			}
		}
	}
}