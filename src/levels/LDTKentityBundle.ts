import { Vector3 } from 'three'
import type { With } from 'miniplex'
import type { EntityIdentifiers, LDTKComponents, NodeId } from './LDTKEntities'
import type { EntityInstance, FieldInstance, LayerInstance } from './LDTKMap'
import type { Entity } from '@/global/entity'

export interface LDTKEntityInstance { id: NodeId }

export const LDTKBundles = {
	Node: ['position'],
	NPC: [],
} as const satisfies Record<keyof LDTKComponents, readonly (keyof Entity)[]>

const getValue = (field: FieldInstance) => {
	if (field.__type === 'Array<EntityRef>') {
		return field.__value.map((x: { entityIid: NodeId }) => x.entityIid)
	} else {
		return field.__value
	}
}

const getEntityValues = <T extends EntityIdentifiers>(entityInstance: EntityInstance) => {
	const data: Record<string, any> = {}
	for (const field of entityInstance.fieldInstances) {
		data[field.__identifier] = getValue(field)
	}
	return data as Entity[T]
}

export const ldtkEntityInstanceBundle = <T extends keyof LDTKComponents >(entityInstance: EntityInstance, layerInstance: LayerInstance) => {
	const ldtkEntityInstance: LDTKEntityInstance = { id: entityInstance.iid as NodeId }
	const entity: Entity = { ldtkEntityInstance }
	const entityType = entityInstance.__identifier as T
	entity[entityType] = getEntityValues<typeof entityType>(entityInstance)
	const componentsToAdd = LDTKBundles[entityType] as readonly (keyof Entity)[]
	if (componentsToAdd.includes('position')) {
		const w = layerInstance.__cWid * layerInstance.__gridSize
		const h = layerInstance.__cHei * layerInstance.__gridSize
		entity.position = new Vector3(entityInstance.px[0] - w / 2, -entityInstance.px[1] + h / 2)
	}

	return entity as With<Entity, T | typeof LDTKBundles[T][number] | 'ldtkEntityInstance'>
}
