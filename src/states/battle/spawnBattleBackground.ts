import { Texture, Vector3 } from 'three'
import { assets, ecs } from '@/global/init'
import { drawLayer } from '@/levels/buildLevel'
import { Sprite } from '@/lib/sprite'
import { getOffscreenBuffer } from '@/utils/buffer'

export const spawnBattleBackground = () => {
	const level = assets.levels.battle.levels[2]
	const buffer = getOffscreenBuffer(level.pxWid, level.pxHei)
	if (level.layerInstances) {
		for (const layerInstance of level.layerInstances.toReversed()) {
			switch (layerInstance.__type) {
				case 'IntGrid':
				case 'Tiles': drawLayer(layerInstance, buffer); break
			}
		}
	}

	const background =	ecs.add({
		position: new Vector3(0, 0),
		sprite: new Sprite(new Texture(buffer.canvas)),
	})
	background.sprite.receiveShadow = true
}