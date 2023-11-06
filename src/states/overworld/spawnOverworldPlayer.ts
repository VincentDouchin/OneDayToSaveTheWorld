import { ecs } from '@/global/init'
import { animationBundle } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'
import { playerInputMap } from '@/global/inputMaps'

const mapQuery = ecs.with('map')
const nodesQuery = ecs.with('Node')
export const spawnOverworldPlayer = () => {
	const [map] = mapQuery
	for (const node of nodesQuery) {
		const { Node, position } = node
		if (Node.start) {
			addTag(node, 'currentNode')
			ecs.add({
				...animationBundle('paladin', 'idle', 'right', 'down'),
				...playerInputMap(),
				position: position?.clone(),
				cameraTarget: true,
				parent: map,
				navigator: true,
			})
		}
	}
}