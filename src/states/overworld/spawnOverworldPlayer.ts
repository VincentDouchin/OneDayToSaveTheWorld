import { ecs } from '@/global/init'
import { menuInputMap } from '@/global/inputMaps'
import { characterAnimationBundle } from '@/lib/animations'
import { addTag } from '@/lib/hierarchy'
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
				...menuInputMap(),
				position: position?.clone(),
				cameraTarget: true,
				parent: map,
				navigator: true,
				...characterSoundsBundle('paladin'),
			})
		}
	}
}