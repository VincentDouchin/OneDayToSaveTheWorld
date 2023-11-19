import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat'
import { Texture, Vector3 } from 'three'
import { assets, ecs } from '../../global/init'
import { drawLayer, getPlatesDimensions } from '../../levels/buildLevel'
import { debugTexture, getScreenBuffer } from '../../utils/buffer'
import { cameraBoundsFromLevel } from '@/global/camera'
import type { dungeonRessources } from '@/global/states'
import { ldtkEntityBodyBundle, ldtkEntityInstanceBundle, ldtkEntityPositionBundle } from '@/levels/LDTKentityBundle'
import { Sprite } from '@/lib/sprite'
import type { System } from '@/lib/state'
import { dungeonPlayerBundle } from '@/states/dungeon/dungeonPlayerBundle'
import { getFileName } from '@/utils/assetLoaders'
import { transformBundle } from '@/lib/transforms'

export const spawnDungeon: System<dungeonRessources> = ({ dungeon, levelIndex, direction }) => {
	const mapName = getFileName(dungeon) as levels
	const map = assets.levels[mapName]
	const level = map.levels[levelIndex]

	const buffer = getScreenBuffer(level.pxWid, level.pxHei)
	const dungeonEntity = ecs.add({
		...cameraBoundsFromLevel(level),
		position: new Vector3(),
		dungeonMap: true,
		sprite: new Sprite(new Texture(buffer.canvas)).setRenderOrder(-1),
	})

	if (level.layerInstances) {
		for (const layerInstance of level.layerInstances.toReversed()) {
			if (layerInstance.__identifier === 'Collisions') {
				for (const { w, h, x, y } of getPlatesDimensions(map, layerInstance, 'Wall')) {
					ecs.add({
						...transformBundle(x, y),
						bodyDesc: RigidBodyDesc.fixed(),
						colliderDesc: ColliderDesc.cuboid(w / 2, h / 2),
						parent: dungeonEntity,
					})
				}
			}
			switch (layerInstance.__type) {
				case 'IntGrid':
				case 'Tiles': drawLayer(layerInstance, buffer); break
				case 'Entities':
					for (const entityInstance of layerInstance.entityInstances) {
						switch (entityInstance.__identifier) {
							case 'Entrance':{
								const entrance = ldtkEntityInstanceBundle<'Entrance'>(entityInstance)
								ecs.add({
									parent: dungeonEntity,
									...entrance,
									...ldtkEntityPositionBundle(entityInstance, layerInstance),
									...ldtkEntityBodyBundle(entityInstance, true),
								})
								if (entrance.Entrance.direction === direction) {
									ecs.add({
										parent: dungeonEntity,
										...dungeonPlayerBundle(),
										...ldtkEntityPositionBundle(entityInstance, layerInstance),
									})
								}
							}
						}
					};break
			}
		}
	}
	dungeonEntity.sprite.setTexture(new Texture(buffer.canvas))
}