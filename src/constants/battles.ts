import { type Enemy, enemies } from './enemies'

export interface BattleData {
	enemies: readonly Enemy<any>[]
	background: number
	onExit?: () => void
	cutscene?: () => void
}
export const battles = {
	ForestAnimals: {
		enemies: [enemies.bat, enemies.wolf, enemies.bat],
		background: 1,
	},
	Bear: {
		enemies: [enemies.bear],
		background: 1,
	},
} as const satisfies Record<string, BattleData>