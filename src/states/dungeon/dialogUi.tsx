import type { With } from 'miniplex'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { Selectable } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { sleep } from '@/utils/sleep'

const stepDialog = (entity: With<Entity, 'dialog'>, index: number | void) => {
	const nextDialog = entity.dialog.next(index).value
	if (nextDialog) {
		entity.currentDialog = nextDialog
	} else {
		sleep(100).then(() => {
			ecs.removeComponent(entity, 'cameraTarget')
			ecs.removeComponent(entity, 'menu')
			ecs.removeComponent(entity, 'currentDialog')
		})
	}
}
export const dialogUi = (entity: With<Entity, 'dialog' | 'cameraTarget' | 'menuId'>) => {
	return (
		(entity.menu)
			? (
				<Nineslice img="textbox" margin={5} style={{ translate: '0% -50%', maxWidth: '20rem', fontSize: '2rem', display: 'grid', gap: '0.5rem' }}>
					{
				Array.isArray(entity.currentDialog)
					? entity.currentDialog.map((text, index) => {
						return (
							<Selectable
								tag={`text${index}`}
								style={{ textDecoration: entity.selectedElement === `text${index}` ? 'underline' : '' }}
								menu={entity}
								onClick={() => stepDialog(entity, index)}
							>
								{text}
							</Selectable>
						) },
					)
					: (
						<Selectable
							tag="text"
							onClick={() => stepDialog(entity)}
							menu={entity}
						>
							{entity.currentDialog}
						</Selectable>
						)

			}
				</Nineslice>
				)
			: entity.cameraTarget
				? <PixelImage img={assets.ui.dialogIcon}></PixelImage>
				: <></>
	)
}