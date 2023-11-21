import type { With } from 'miniplex'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { PixelImage } from '@/ui/pixelImage'

const player = ecs.with('playerInputMap')
export const dialogUi = (entity: With<Entity, 'dialog' | 'cameraTarget'>) => {
	if (player.first?.playerInputMap.get('interact').justPressed) {
		const nextDialog = entity.dialog.next().value
		if (nextDialog) {
			entity.currentDialog = nextDialog
		}
	}
	return (
		entity.currentDialog
			? <div>{entity.currentDialog}</div>
			: entity.cameraTarget
				? <PixelImage img={assets.ui.dialogIcon}></PixelImage>
				: <></>
	)
}