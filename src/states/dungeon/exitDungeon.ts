import { ecs, world } from '@/global/init'
import type { dungeonRessources } from '@/global/states'
import { dungeonState, overWorldState } from '@/global/states'
import { otherDirection } from '@/lib/direction'
import type { System } from '@/lib/state'

const playerEnteredQuery = ecs.with('collider', 'playerInputMap')
const entranceQuery = ecs.with('Entrance', 'collider')
export const exitDungeon: System<dungeonRessources> = (props) => {
	for (const entity of playerEnteredQuery) {
		const isInEntrance = Array.from(entranceQuery).find(({ collider }) => {
			return world.intersectionPair(collider, entity.collider)
		})

		if (!isInEntrance && entity.justEntered && entranceQuery.size > 0) {
			ecs.removeComponent(entity, 'justEntered')
		}
		if (!entity.justEntered && isInEntrance) {
			if (isInEntrance.Entrance.levelIndex === null) {
				overWorldState.enable({ direction: otherDirection[isInEntrance.Entrance.direction] })
			} else {
				dungeonState.disable()
				dungeonState.enable({ ...props, levelIndex: isInEntrance.Entrance.levelIndex, direction: isInEntrance.Entrance.direction })
			}
		}
	}
}
