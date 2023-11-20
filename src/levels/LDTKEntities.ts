import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { direction } from '@/lib/direction'

export type NodeId = string & { __type: 'nodeId' }
export type EntityIdentifiers = keyof LDTKComponents
export interface LDTKComponents {
	Node: {
		directions: Array<NodeId>
		battle?: typeof LDTKEnums['battles'][number]
		start: boolean
		dungeon?: levels
		level?: number
		treasure?: typeof LDTKEnums['treasure']
		lock?: typeof LDTKEnums['locks'][number]
	}
	NPC: {
		name: string
	}
	Entrance: {
		direction: direction
		levelIndex: number | null
	}

}
