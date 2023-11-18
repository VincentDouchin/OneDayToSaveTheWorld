import type { Effect } from './battlerEffects'
import { bladesEffects } from './battlerEffects'
import type { playerNames } from '@/constants/players'
import type { Entity } from '@/global/entity'
import { assets } from '@/global/init'

// ! Battler
export enum ActionSelector {
	PlayerMenu,
	EnemyAuto,
}
export enum TargetSelector {
	PlayerTargetMenu,
	EnemyAuto,
}
export enum BattlerType {
	Player,
	Enemy,
}
export const battlerBundle = (type: BattlerType): Entity => {
	const player = type === BattlerType.Player
	return {
		battler: type,
		actionSelector: player ? ActionSelector.PlayerMenu : ActionSelector.EnemyAuto,
		targetSelector: player ? TargetSelector.PlayerTargetMenu : TargetSelector.EnemyAuto,
	}
}
// ! Battler Actions
export enum TargetType {
	Self,
	Others,
	Same,
	AllOthers,
	AllSame,
	All,
	Any,
}
export enum ActionType {
	Damage,
	Heal,
	Flee,
}
export type BattleAction<K extends keyof characterAnimations> = {
	label: string
	icon?: HTMLImageElement
	targetAmount: number
	power: number
	target: TargetType
	type: ActionType
	animation: characterAnimations[K][]
	sound?: Howl
} & Effect
export const PlayerActions: { [k in playerNames]: BattleAction<k>[] } = {
	paladin: [
		{
			label: 'Attack',
			icon: assets.heroIcons.paladinAttack1,
			target: TargetType.Others,
			power: 2,
			targetAmount: 1,
			type: ActionType.Damage,
			animation: ['attack'],
			sound: assets.sounds.paladin.attack,
		},
		{
			label: 'Blades',
			icon: assets.heroIcons.paladinAttack2,
			target: TargetType.Others,
			power: 1,
			targetAmount: 2,
			type: ActionType.Damage,
			animation: ['dictum'],
			...bladesEffects,
			sound: assets.sounds.paladin['blades-of-justice-cast'],
		},
	],
}
export const singleEnemyAttack = <C extends keyof characterAnimations>(animation: characterAnimations[C], power = 1) => ({
	label: 'Attack',
	target: TargetType.Others,
	power,
	targetAmount: 1,
	type: ActionType.Damage,
	animation: [animation],
})