import { type Enemy, enemies } from './enemies'
import type LDTKEnums from './exports/LDTKEnums'

export interface BattleData {
	enemies: readonly Enemy<any>[]
	background: number
	reward: number
	onEnter?: () => void | Promise<unknown>
	onExit?: () => void | Promise<unknown>
}
export const battles: Record<typeof LDTKEnums['battles'][number], BattleData> = {
	forestanimals: {
		enemies: [enemies.bat, enemies.wolf, enemies.bat],
		background: 1,
		reward: 2,
	},
	bear: {
		enemies: [enemies.bear],
		background: 1,
		reward: 1,
	},
	bandits: {
		enemies: [enemies.bandit],
		background: 1,
		reward: 5,
	},
}