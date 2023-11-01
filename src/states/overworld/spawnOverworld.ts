import { Vector3 } from 'three'
import { assets, ecs } from '../../global/init'
import { drawLayer } from '../../levels/buildLevel'
import { getScreenBuffer } from '../../utils/buffer'
import { Sprite } from '@/lib/sprite'

export const spawnOverworld = () => {
	const level = assets.levels.overworld.levels[1]
	if (level.layerInstances) {
		const buffer = getScreenBuffer(level.pxWid, level.pxHei)
		for (const layerInstance of level.layerInstances.toReversed()) {
			switch (layerInstance.__type) {
				case 'IntGrid':
				case 'Tiles': drawLayer(layerInstance, buffer)
			}
		}
		// ecs.add({ sprite: Sprite.fromBuffer(buffer), position: new Vector3() })
	}
}