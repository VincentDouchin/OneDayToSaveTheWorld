import { ecs } from '@/global/init'
import { characterAnimationBundle } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'
import { playerInputMap } from '@/global/inputMaps'
import { characterSoundsBundle } from '@/lib/soundEffects'

const mapQuery = ecs.with('map')
const nodesQuery = ecs.with('Node')
export const spawnOverworldPlayer = () => {
	const [map] = mapQuery
	for (const node of nodesQuery) {
		const { Node, position } = node
		if (Node.start) {
			addTag(node, 'currentNode')
			ecs.add({
				...characterAnimationBundle('paladin', 'idle', 'right', 'down'),
				...playerInputMap(),
				position: position?.clone(),
				cameraTarget: true,
				parent: map,
				navigator: true,
				...characterSoundsBundle('paladin'),
			})
		}
	}
}