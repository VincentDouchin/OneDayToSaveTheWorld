import { get, set } from 'idb-keyval'
import { context } from './context'
import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { NodeId } from '@/levels/LDTKEntities'
import type { direction } from '@/lib/direction'
import { ItemData } from './items'

export enum States {
	Overworld,
	Dungeon,
}
interface PlayerData {
	character: 'paladin'
	health: number | null
}
interface TeamData {
	players: PlayerData[]
	money: number
	inventory: ItemData[]
}
interface SaveData {
	settings: { volume: number }
	locks: typeof LDTKEnums['locks'][number][]
	lastBattle: typeof LDTKEnums['battles'][number] | null
	lastNodeUUID: NodeId | null
	nodesVisited: Array<NodeId>
	lastState: States
	lastDungeon: levels | null
	lastDungeonIndex: number | null
	lastDirection: direction | null
	teams: TeamData[]
	currentTeam: number
}
const blankSave = (): SaveData => ({
	settings: { volume: 1 },
	locks: [],
	lastBattle: null,
	lastNodeUUID: null,
	nodesVisited: [],
	lastState: States.Overworld,
	lastDungeon: null,
	lastDungeonIndex: null,
	lastDirection: null,
	teams: [{
		money: 0,
		inventory: [],
		players: [{
			character: 'paladin',
			health: null
		}]
	}],
	currentTeam: 0
})
export const save: Readonly<SaveData> = blankSave()

export const getSave = async () => {
	const saveName = context.save
	const data = await get<SaveData>(saveName)
	if (data) {
		Object.assign(save, data)
	}
}
export const updateSave = (saveFn: (save: SaveData) => void) => {
	saveFn(save)
	set(context.save, save)
}
