import { type Enemy, enemies } from './enemies'
import type LDTKEnums from './exports/LDTKEnums'

export interface BattleData {
	enemies: readonly Enemy<any>[]
	background: number
	onEnter?: () => void | Promise<unknown>
	onExit?: () => void | Promise<unknown>
}
export const battles: Record<typeof LDTKEnums['battles'][number], BattleData> = {
	ForestAnimals: {
		enemies: [enemies.bat, enemies.wolf, enemies.bat],
		background: 1,
	},
	Bear: {
		enemies: [enemies.bear],
		background: 1,
	},
}