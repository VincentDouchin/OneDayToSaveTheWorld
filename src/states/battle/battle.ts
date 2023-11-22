import { Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'
import { battlerQuery, canHaveTurnQuery, currentActionQuery, currentTurnQuery, getPossibleTargets, targetQuery } from './battleQueries'
import { damageNumber } from './battleUi'
import { ActionSelector, BattlerType, TargetSelector } from './battlerBundle'
import { takeDamage } from './health'
import { battles } from '@/constants/battles'
import { ecs } from '@/global/init'
import { battleExitState, type battleRessources, battleState, overWorldState } from '@/global/states'
import { playAnimationChain } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'
import type { System } from '@/lib/state'
import { damageEffectBundle } from '@/utils/effects/damage'

export const selectBattler = () => {
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
		const opacity = { opacity: 100 }
		const uiPosition = new Vector3(0, 8)
		const damageNumberEntity = ecs.add({
			position: target.position,
			uiPosition,
			template: damageNumber(-currentAction.power, opacity),
			tween: new Tween([opacity, uiPosition]).to([{ opacity: 0 }, new Vector3(0, 16)], 1000).onComplete(() => {
				ecs.remove(damageNumberEntity)
			}),
		})
		ecs.add({
			...damageEffectBundle(500),
			position: target.position,
		})
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
	for (const entity of currentTurnQuery) {
		if (!entity.currentAction) {
			selectAction()
		} else if (!allTargetsSelected()) {
			selectTargets()
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

export const battleEnter: System<battleRessources> = async (props) => {
	const battleData = battles[props.battle]
	if (battleData.onEnter) {
		const promise = battleData.onEnter()
		if (promise) {
			await promise
		}
	}
	battleState.enable(props)
}
const enemiesQuery = ecs.with('battler').where(e => e.battler === BattlerType.Enemy)
export const endBattle: System<battleRessources> = (props) => {
	if (enemiesQuery.size === 0) {
		battleExitState.enable(props)
	}
}

export const battleExit: System<battleRessources> = async (props) => {
	const battleData = battles[props.battle]
	if (battleData.onExit) {
		const promise = battleData.onExit()
		if (promise) {
			await promise
		}
	}
	overWorldState.enable(props)
}