import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat'
import type { With } from 'miniplex'
import type { EntityIdentifiers, LDTKComponents, NodeId } from './LDTKEntities'
import type { EntityInstance, FieldInstance, LayerInstance } from './LDTKMap'
import { transformBundle } from '@/lib/transforms'
import type { Entity } from '@/global/entity'
import { getFileName } from '@/utils/assetLoaders'

export interface LDTKEntityInstance { id: NodeId }

const getValue = (field: FieldInstance) => {
	if (field.__type === 'FilePath') {
		return field.__value ? getFileName(field.__value) : null
	} else	if (field.__type === 'Array<EntityRef>') {
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

export const ldtkEntityPositionBundle = (entityInstance: EntityInstance, layerInstance: LayerInstance) => {
	const w = layerInstance.__cWid * layerInstance.__gridSize
	const h = layerInstance.__cHei * layerInstance.__gridSize
	const x = entityInstance.px[0] - w / 2
	const y = -entityInstance.px[1] + h / 2
	return transformBundle(x, y)
}

export const ldtkEntityBodyBundle = (entityInstance: EntityInstance, sensor = false): Entity => {
	const bodyDesc = RigidBodyDesc.fixed()
	const colliderDesc = ColliderDesc.cuboid(entityInstance.width / 2, entityInstance.height / 2).setSensor(sensor)
	return { bodyDesc, colliderDesc }
}

export const ldtkEntityInstanceBundle = <T extends keyof LDTKComponents >(entityInstance: EntityInstance) => {
	const ldtkEntityInstance: LDTKEntityInstance = { id: entityInstance.iid as NodeId }
	const entity: Entity = { ldtkEntityInstance }
	const entityType = entityInstance.__identifier as T
	entity[entityType] = getEntityValues<typeof entityType>(entityInstance)
	return entity as With<Entity, T | 'ldtkEntityInstance'>
}
