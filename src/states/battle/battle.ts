import type { With } from 'miniplex'
import { ActionSelector, TargetSelector, TargetType } from './battlerBundle'
import { takeDamage } from './health'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { playAnimationChain } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'

const battlerQuery = ecs.with('battler', 'battleActions', 'actionSelector', 'targetSelector')
const currentTurnQuery = battlerQuery.with('currentTurn')
export const currentActionQuery = currentTurnQuery.with('currentAction')

const canHaveTurnQuery = battlerQuery.without('finishedTurn')
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
const takingActionQuery = ecs.with('takingAction', 'currentAction', 'state', 'animationTimer', 'position')

export const takeAction = () => takingActionQuery.onEntityAdded.subscribe(async (entity) => {
	const { currentAction } = entity
	if (currentAction.selfEffects) {
		currentAction.selfEffects()
	}
	if (currentAction.sound) {
		currentAction.sound.play()
	}
	await playAnimationChain(entity, currentAction.animation)

	if (currentAction.targetEffects) {
		await currentAction.targetEffects()
	}
	await Promise.all(Array.from(targetQuery).map(async (target) => {
		ecs.removeComponent(target, 'target')
		await playAnimationChain(target, ['dmg'])
		await takeDamage(target, -currentAction.power)
	}))
	ecs.removeComponent(entity, 'currentAction')
	ecs.removeComponent(entity, 'currentTurn')
	ecs.removeComponent(entity, 'takingAction')
	ecs.addComponent(entity, 'finishedTurn', true)
})
const finishedQuery = ecs.with('finishedTurn')
export const resetTurn = () => {
	if (finishedQuery.size === battlerQuery.size) {
		for (const battler of battlerQuery) {
			ecs.removeComponent(battler, 'finishedTurn')
		}
	}
}

const selectTargets = () => {
	const entity = currentActionQuery.first
	if (entity) {
		const targets = getPossibleTargets()
		switch (entity.targetSelector) {
			case TargetSelector.PlayerTargetMenu:{
				const [menu] = battlerMenuQuery
				if (menu.menuInputMap.get('cancel').justPressed) {
					ecs.removeComponent(entity, 'currentAction')
				}
			};break
			case TargetSelector.EnemyAuto:{
				for (let i = 0; i < entity.currentAction.targetAmount; i++) {
					addTag(targets[i], 'target')
				}
				addTag(entity, 'takingAction')
			}
		}
	}
}
export const allTargetsSelected = () => {
	const currentAction = currentActionQuery.first?.currentAction
	const possibleTargets = getPossibleTargets().length
	const targets = targetQuery.size
	return currentAction && targets === Math.min(currentAction?.targetAmount, possibleTargets)
}

export const battle = () => {
	if (currentTurnQuery.size === 0) {
		selectBattler()
	} else {
		for (const entity of currentTurnQuery) {
			if (!entity.currentAction) {
				selectAction()
			} else if (!allTargetsSelected()) {
				selectTargets()
			}
		}
	}
}

const enableTargetSelectorMenu = () => currentActionQuery.onEntityAdded.subscribe(() => {
	targetSelectorMenuQuery.first && addTag(targetSelectorMenuQuery.first, 'menu')
})
const disableTargetSelectorMenu = () => currentActionQuery.onEntityRemoved.subscribe(() => {
	if (targetSelectorMenuQuery.first) {
		ecs.removeComponent(targetSelectorMenuQuery.first, 'menu')
		for (const target of targetQuery) {
			ecs.removeComponent(target, 'target')
		}
	}
})
export const targetSelectionMenu = [enableTargetSelectorMenu, disableTargetSelectorMenu]