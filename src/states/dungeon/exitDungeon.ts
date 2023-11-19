import { ecs, world } from '@/global/init'
import { overWorldState } from '@/global/states'
import { otherDirection } from '@/lib/direction'

const playerEnteredQuery = ecs.with('collider', 'playerInputMap')
const entranceQuery = ecs.with('Entrance', 'collider')
export const exitDungeon = () => {
	for (const entity of playerEnteredQuery) {
		const isInEntrance = Array.from(entranceQuery).find(({ collider }) => {
			return world.intersectionPair(collider, entity.collider)
		})
		if (!isInEntrance && entity.justEntered && entranceQuery.size > 0) {
			ecs.removeComponent(entity, 'justEntered')
		}
		if (!entity.justEntered && isInEntrance) {
			overWorldState.enable({ direction: otherDirection[isInEntrance.Entrance.direction] })
		}
	}
}