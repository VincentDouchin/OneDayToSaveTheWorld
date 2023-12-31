import { States, getSave, save } from '@/global/save'
import { dungeonState, overWorldState } from '@/global/states'

export const setupGame = async () => {
	await getSave()
	if (save.lastState === States.Dungeon && save.lastDungeon && save.lastDungeonIndex !== null && save.lastDirection) {
		dungeonState.enable({
			dungeon: save.lastDungeon,
			levelIndex: save.lastDungeonIndex,
			direction: save.lastDirection,
		})
	}
	if (save.lastState === States.Overworld) {
		 overWorldState.enable({})
	}
}