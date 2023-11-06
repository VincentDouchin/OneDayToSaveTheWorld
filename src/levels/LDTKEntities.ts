import type LDTKEnums from '@/constants/exports/LDTKEnums'

export type NodeId = string & { __type: 'nodeId' }
export type EntityIdentifiers = keyof LDTKComponents
export interface LDTKComponents {
	Node: {
		directions: Array<NodeId>
		battle?: typeof LDTKEnums['battles']
		start: boolean
		dungeon?: string
		level?: number
		treasure?: typeof LDTKEnums['treasure']
		lock?: typeof LDTKEnums['locks'][number]
	}
	NPC: {
		name: string
	}
}
