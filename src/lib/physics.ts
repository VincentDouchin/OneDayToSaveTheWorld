import type { State } from './state'
import { ecs, world } from '@/global/init'

const addBodies = () => ecs.with('bodyDesc', 'worldPosition').onEntityAdded.subscribe((entity) => {
	const body = world.createRigidBody(entity.bodyDesc)
	body.setTranslation(entity.worldPosition, true)
	ecs.addComponent(entity, 'body', body)
	ecs.removeComponent(entity, 'bodyDesc')
})
const addColliders = () => ecs.with('body', 'colliderDesc').onEntityAdded.subscribe((entity) => {
	const collider = world.createCollider(entity.colliderDesc, entity.body)
	ecs.addComponent(entity, 'collider', collider)
	ecs.removeComponent(entity, 'colliderDesc')
})
const removeColliders = () => ecs.with('collider').onEntityRemoved.subscribe((entity) => {
	world.removeCollider(entity.collider, true)
})
const removeBodies = () => ecs.with('body').onEntityRemoved.subscribe((entity) => {
	world.removeRigidBody(entity.body)
})
export const stepWorld = () => {
	world.step()
}
export const physicsPlugin = (state: State) => {
	state
		.addSubscriber(addBodies, addColliders, removeColliders, removeBodies)
		// .onPreUpdate(stepWorld)
}