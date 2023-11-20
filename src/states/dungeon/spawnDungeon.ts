import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat'
import { Texture, Vector3 } from 'three'
import { assets, ecs } from '../../global/init'
import { drawLayer, getPlatesDimensions } from '../../levels/buildLevel'
import { getScreenBuffer } from '../../utils/buffer'
import { cameraBoundsFromLevel } from '@/global/camera'
import { States, updateSave } from '@/global/save'
import type { dungeonRessources } from '@/global/states'
import { ldtkEntityBodyBundle, ldtkEntityInstanceBundle, ldtkEntityPositionBundle } from '@/levels/LDTKentityBundle'
import { Sprite } from '@/lib/sprite'
import type { System } from '@/lib/state'
import { transformBundle } from '@/lib/transforms'
import { dungeonPlayerBundle } from '@/states/dungeon/dungeonPlayerBundle'
import { characterAnimationBundle } from '@/lib/animations'

export const spawnDungeon: System<dungeonRessources> = ({ dungeon, levelIndex, direction }) => {
	const map = assets.levels[dungeon]
	const level = map.levels[levelIndex]
	updateSave((s) => {
		s.lastDungeon = dungeon
		s.lastDungeonIndex = levelIndex
		s.lastDirection = direction
		s.lastState = States.Dungeon
	})

	const dungeonEntity = ecs.add({
		...cameraBoundsFromLevel(level),
		...transformBundle(0, 0),
		dungeonMap: true,
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
				case 'Tiles': {
					const buffer = getScreenBuffer(level.pxWid, level.pxHei)
					const z = layerInstance.__identifier.toLowerCase().includes('top') ? 1 : 0
					drawLayer(layerInstance, buffer)
					ecs.add({
						parent: dungeonEntity,
						position: new Vector3(0, 0, z),
						sprite: new Sprite(new Texture(buffer.canvas)),
					})
				}; break
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
							};break
							case 'NPC':{
								ecs.add({
									parent: dungeonEntity,
									...ldtkEntityPositionBundle(entityInstance, layerInstance),
									...ldtkEntityInstanceBundle<'NPC'>(entityInstance),
									...characterAnimationBundle('howard', 'idle'),
								})
							};break
							case 'Sign':{
								ecs.add({
									parent: dungeonEntity,
									...ldtkEntityPositionBundle(entityInstance, layerInstance),
									...ldtkEntityInstanceBundle<'NPC'>(entityInstance),
									...ldtkEntityBodyBundle(entityInstance),
									sprite: new Sprite(assets.sprites.sign),
								})
							};break
						}
					};break
			}
		}
	}
}