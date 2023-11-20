import { ecs, world } from '@/global/init'
import type { dungeonRessources } from '@/global/states'
import { dungeonState, overWorldState } from '@/global/states'
import { otherDirection } from '@/lib/direction'
import type { System } from '@/lib/state'

const playerEnteredQuery = ecs.with('collider', 'playerInputMap')
const entranceQuery = ecs.with('entrance', 'collider')
export const exitDungeon: System<dungeonRessources> = (props) => {
	for (const entity of playerEnteredQuery) {
		const entrance = Array.from(entranceQuery).find(({ collider }) => {
			return world.intersectionPair(collider, entity.collider)
		})

		if (!entrance && entity.justEntered && entranceQuery.size > 0) {
			ecs.removeComponent(entity, 'justEntered')
		}
		if (!entity.justEntered && entrance) {
			if (entrance.entrance.levelIndex === null) {
				overWorldState.enable({ direction: otherDirection[entrance.entrance.direction] })
			} else {
				dungeonState.disable()
				dungeonState.enable({ ...props, levelIndex: entrance.entrance.levelIndex, direction: entrance.entrance.direction })
			}
		}
	}
}
