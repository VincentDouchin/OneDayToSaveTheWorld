import { get, set } from 'idb-keyval'
import { context } from './context'
import type { ItemData } from './items'
import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { PlayerData } from '@/constants/players'
import { players } from '@/constants/players'
import type { NodeId } from '@/levels/LDTKEntities'
import type { direction } from '@/lib/direction'

export enum States {
	Overworld,
	Dungeon,
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
		players: [players().paladin],
	}],
	currentTeam: 0,
})

export const save: Readonly<SaveData> = blankSave()

export const getSave = async () => {
	const saveName = context.save
	const data = await get<SaveData>(saveName)
	if (data) {
		Object.assign(save, data)
	}
}
export const updateSave = async (saveFn: (save: SaveData) => void) => {
	saveFn(save)
	await set(context.save, save)
}

export const resetRun = () => updateSave((s) => {
	for (const team of s.teams) {
		for (const player of team.players) {
			player.currentHealth = player.maxHealth
		}
	}
	s.lastNodeUUID = null
	s.lastBattle = null
	s.lastDungeon = null
	s.lastDungeonIndex = null
	s.lastDirection = null
})
