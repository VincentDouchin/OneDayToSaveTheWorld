import { type BattleAction, singleEnemyAttack } from '@/states/battle/battlerBundle'

export interface Enemy<K extends characters> {
	atlas: K
	actions: readonly BattleAction<K>[]
	hp: number
}

export const enemies = {
	bat: {
		atlas: 'bat',
		actions: [singleEnemyAttack<'bat'>('attack')],
		hp: 3,
	},
	wolf: {
		atlas: 'wolf',
		actions: [singleEnemyAttack<'wolf'>('attack')],
		hp: 4,
	},
	bear: {
		atlas: 'bear',
		actions: [singleEnemyAttack<'bear'>('attack')],
		hp: 7,
	},
} as const satisfies { [k in characters]?: Enemy<k> }