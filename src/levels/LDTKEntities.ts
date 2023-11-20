import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { direction } from '@/lib/direction'

export type NodeId = string & { __type: 'nodeId' }
export type EntityIdentifiers = keyof LDTKComponents
export interface LDTKComponents {
	node: {
		directions: Array<NodeId>
		battle?: typeof LDTKEnums['battles'][number]
		start: boolean
		dungeon?: levels
		level?: number
		treasure?: typeof LDTKEnums['treasure']
		lock?: typeof LDTKEnums['locks'][number]
	}
	npc: {
		name: typeof LDTKEnums['NPC'][number]
	}
	entrance: {
		direction: direction
		levelIndex: number | null
	}

}
