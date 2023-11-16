import { get, set } from 'idb-keyval'
import { context } from './context'
import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { NodeId } from '@/levels/LDTKEntities'

interface SaveData {
	locks: typeof LDTKEnums['locks'][number][]
	lastBattle: typeof LDTKEnums['battles'][number] | null
	lastNodeUUID: NodeId | null
	nodesVisited: Array<NodeId>
}
const blankSave = (): SaveData => ({
	locks: [],
	lastBattle: null,
	lastNodeUUID: null,
	nodesVisited: [],
})
export const save: Readonly<SaveData> = blankSave()

export const getSave = () => {
	const save = context.save
	const data = get<SaveData>(save)
	if (data) {
		Object.assign(save, data)
	}
}
export const updateSave = (saveFn: (save: SaveData) => void) => {
	saveFn(save)
	set(context.save, save)
}