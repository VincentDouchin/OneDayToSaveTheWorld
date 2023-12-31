import { Vector2 } from 'three'
import { ecs, time } from '@/global/init'

const playerQuery = ecs.with('playerInputMap', 'body', 'directionX', 'directionY', 'state', 'cameraTargetOffset').without('locked')
export const movePlayer = () => {
	for (const entity of playerQuery) {
		const { playerInputMap, body } = entity
		const force = new Vector2()
		const speed = 5
		force.x += playerInputMap.get('right').pressed
		force.x -= playerInputMap.get('left').pressed
		force.y += playerInputMap.get('up').pressed
		force.y -= playerInputMap.get('down').pressed
		if (playerInputMap.get('right').pressed) {
			entity.directionX = 'right'
			entity.cameraTargetOffset = 'right'
		}
		if (playerInputMap.get('left').pressed) {
			entity.directionX = 'left'
			entity.cameraTargetOffset = 'left'
		}
		if (playerInputMap.get('up').pressed) {
			entity.directionY = 'up'
			entity.cameraTargetOffset = 'up'
		}
		if (playerInputMap.get('down').pressed) {
			entity.directionY = 'down'
			entity.cameraTargetOffset = 'down'
		}

		const isMoving = force.length() > 0
		force.normalize().multiplyScalar(time.delta * speed)
		entity.state = isMoving ? 'walk' : 'idle'
		body.setLinvel(force, true)
	}
}