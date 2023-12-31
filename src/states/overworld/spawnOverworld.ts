import { Texture, Vector3 } from 'three'
import type { With } from 'miniplex'
import { assets, ecs } from '../../global/init'
import { drawLayer } from '../../levels/buildLevel'
import { getScreenBuffer } from '../../utils/buffer'
import { cameraBoundsFromLevel } from '@/global/camera'
import { States, save, updateSave } from '@/global/save'
import { ldtkEntityInstanceBundle, ldtkEntityPositionBundle } from '@/levels/LDTKentityBundle'
import { Sprite } from '@/lib/sprite'
import type { Entity } from '@/global/entity'

const addnodeSprite = (nodeEntity: With<Entity, 'node'>) => {
	if (nodeEntity.node.battle) {
		ecs.addComponent(nodeEntity, 'sprite', new Sprite(assets.mapIcons.nodeIcon))
		ecs.add({
			sprite: new Sprite(assets.mapIcons.battleIcon),
			parent: nodeEntity,
			position: new Vector3(),
		})
	} else if (nodeEntity.node.dungeon) {
		ecs.addComponent(nodeEntity, 'sprite', new Sprite(assets.mapIcons.nodeIcon))
		ecs.add({
			sprite: new Sprite(assets.mapIcons.houseIcon),
			parent: nodeEntity,
			position: new Vector3(),
		})
	} else if (nodeEntity.node.treasure) {
		ecs.addComponent(nodeEntity, 'sprite', new Sprite(assets.mapIcons.nodeIcon))
	} else {
		ecs.addComponent(nodeEntity, 'sprite', new Sprite(assets.mapIcons.smallNodeIcon))
	}
}

export const spawnOverworld = () => {
	const level = assets.levels.overworld.levels[1]
	const map = ecs.add({
		...cameraBoundsFromLevel(level),
		fitWidth: true,
		position: new Vector3(),
		map: true,
	})
	updateSave((s) => {
		s.lastState = States.Overworld
	})

	if (level.layerInstances) {
		const buffer = getScreenBuffer(level.pxWid, level.pxHei)
		for (const layerInstance of level.layerInstances.toReversed()) {
			switch (layerInstance.__type) {
				case 'IntGrid':
				case 'Tiles': drawLayer(layerInstance, buffer); break
				case 'Entities':
					for (const entityInstance of layerInstance.entityInstances) {
						if (layerInstance.__identifier === 'nodes') {
							const bundle = ldtkEntityInstanceBundle<'node'>(entityInstance)
							if (!bundle.node?.lock || save.locks.includes(bundle.node.lock)) {
								const nodeEntity = ecs.add({
									...ldtkEntityInstanceBundle(entityInstance),
									...ldtkEntityPositionBundle(entityInstance, layerInstance),
									parent: map,
								})
								addnodeSprite(nodeEntity)
							}
						}
					}
					;break
			}
		}
		ecs.addComponent(map, 'sprite', new Sprite(new Texture(buffer.canvas)).setRenderOrder(-1))
	}
}