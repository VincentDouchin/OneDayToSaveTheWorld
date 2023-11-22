import type { With } from 'miniplex'
import type { ComponentsOfType, Entity } from '../global/entity'
import { ecs } from '../global/init'
import { type State, set } from './state'
import { time } from '@/global/init'

const addChildren = () => ecs.onEntityAdded.subscribe((entity) => {
	if (entity.parent) {
		if (entity.parent.children) {
			entity.parent.children.add(entity)
		}
		else {
			ecs.addComponent(entity.parent, 'children', new Set([entity]))
		}
	}
	if (entity.children) {
		for (const child of entity.children) {
			if (!child.parent) {
				ecs.addComponent(child, 'parent', entity)
			}
		}
	}
})

const despanwChildren = () => ecs.with('children').onEntityRemoved.subscribe((entity) => {
	for (const children of entity.children) {
		ecs.remove(children)
	}
})

const removeChildren = () => ecs.with('parent').onEntityRemoved.subscribe((entity) => {
	entity.parent.children?.delete(entity)
})

const damoclesQuery = ecs.with('deathTimer')
export const killEntity = () => {
	for (const entity of damoclesQuery) {
		entity.deathTimer.tick(time.delta)
		if (entity.deathTimer.justFinished) {
			ecs.remove(entity)
		}
	}
}

export const hierarchyPlugin = (state: State) => {
	state.onEnter(addChildren, despanwChildren, removeChildren).onPreUpdate(killEntity)
}
export const removeParent = (entity: Entity) => {
	if (entity.parent) {
		entity.parent.children?.delete(entity)
		ecs.removeComponent(entity, 'parent')
		if (entity.group) {
			entity.group.removeFromParent()
		}
	}
}

export const addTag = (entity: Entity, tag: ComponentsOfType<true>) => ecs.addComponent(entity, tag, true)
export const despawnOfType = (...components: (keyof Entity)[]) => {
	return set(components.map((component) => {
		const query = ecs.with(component)
		return () => {
			for (const entity of query) {
				ecs.remove(entity)
			}
		}
	}))
}
export const hasComponents = <C extends keyof Entity, E extends Entity>(entity: E, ...components: C[]) => {
	if (components.every(component => component in entity)) {
		return entity as With<E, C>
	}
}
