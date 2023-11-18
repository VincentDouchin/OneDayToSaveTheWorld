import { Texture, Vector3 } from 'three'
import { assets, ecs } from '@/global/init'
import { drawLayer } from '@/levels/buildLevel'
import { Sprite } from '@/lib/sprite'
import { getOffscreenBuffer } from '@/utils/buffer'
import { cameraBoundsFromLevel } from '@/global/camera'
import { battles } from '@/constants/battles'
import type { System } from '@/lib/state'
import type { battleRessources } from '@/global/states'

export const spawnBattleBackground: System<battleRessources> = ({ battle }) => {
	const battleData = battles[battle]
	const level = assets.levels.battle.levels[battleData.background]
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
		battleBackground: true,
		position: new Vector3(0, 0),
		sprite: new Sprite(new Texture(buffer.canvas)),
		...cameraBoundsFromLevel(level),
	})
	background.sprite.receiveShadow = true
}