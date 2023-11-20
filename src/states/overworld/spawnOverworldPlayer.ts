import type { With } from 'miniplex'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { menuInputMap } from '@/global/inputMaps'
import { save } from '@/global/save'
import type { overWorldRessources } from '@/global/states'
import type { NodeId } from '@/levels/LDTKEntities'
import { characterAnimationBundle } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'
import { characterSoundsBundle } from '@/lib/soundEffects'
import type { System } from '@/lib/state'

const isStartNode = (node: With<Entity, 'node' | 'ldtkEntityInstance'>, id: NodeId | null) => {
	if (id) return node.ldtkEntityInstance.id === id
	return node.node.start
}

const mapQuery = ecs.with('map')
const nodesQuery = ecs.with('node', 'ldtkEntityInstance')
export const spawnOverworldPlayer: System<overWorldRessources> = ({ battleNodeId, direction: navigating }) => {
	const [map] = mapQuery
	for (const node of nodesQuery) {
		if (isStartNode(node, battleNodeId ?? save.lastNodeUUID)) {
			addTag(node, 'currentNode')
			ecs.add({
				...characterAnimationBundle('paladin', 'idle', 'right', 'down'),
				...menuInputMap(),
				position: node.position?.clone(),
				cameraTarget: true,
				parent: map,
				navigator: true,
				...characterSoundsBundle('paladin'),
				navigating,
			})
		}
	}
}