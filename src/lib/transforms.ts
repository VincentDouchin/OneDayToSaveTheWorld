import { Group, Vector3 } from 'three'
import type { State } from './state'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'

const positionQuery = ecs.with('position', 'group')
export const updateGroupPosition = () => {
	for (const { position, group } of positionQuery) {
		group.position.x = position.x
		group.position.y = position.y
		group.position.z = position.z
	}
}

export const transformBundle = (x: number, y: number): Entity => {
	return {
		group: new Group(),
		position: new Vector3(x, y),
	}
}

// const bodiesWithoutWorldPositionQuery = ecs.with('bodyDesc', 'group').without('worldPosition')
// const addWorldPosition = () => bodiesWithoutWorldPositionQuery.onEntityAdded.subscribe((entity) => {
// 	ecs.addComponent(entity, 'worldPosition', entity.group.position)
// })
const bodiesQuery = ecs.with('body', 'position').where(({ body }) => body.isDynamic())
export const updatePosition = () => {
	for (const { body, position } of bodiesQuery) {
		const bodyPos = body.translation()
		position.x = bodyPos.x
		position.y = bodyPos.y
	}
}

const ySortedQuery = ecs.with('position', 'ySorted')
const sortSprites = () => {
	for (const { position } of ySortedQuery) {
		position.z = 4 - position.y * 0.01
	}
}

export const transformsPlugin = (state: State) => {
	state
		// .addSubscriber(addWorldPosition)
		.onPostUpdate(sortSprites)
}