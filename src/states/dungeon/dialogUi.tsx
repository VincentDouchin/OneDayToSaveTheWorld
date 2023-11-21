import type { Entity } from '@/global/entity'
import { assets } from '@/global/init'
import { Selectable } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import type { With } from 'miniplex'
export const dialogUi = (entity: With<Entity, 'dialog' | 'cameraTarget' | 'menuId'>) => {

	return (
		(entity.menu)
			? <Nineslice img='textbox' margin={5} style={{ fontSize: '2rem', display: 'grid', gap: '0.5rem' }}>{
				Array.isArray(entity.currentDialog)
					? entity.currentDialog.map((text, index) => (
						<Selectable
							tag={'text' + index}
							style={{ textDecoration: entity.selectedElement === 'text' + index ? 'underline' : '' }}
							menu={entity}
							onClick={() => entity.currentDialog = entity.dialog.next(index).value ?? null}
						>{text}</Selectable>
					))
					: <Selectable
						tag="text"
						onClick={() => entity.currentDialog = entity.dialog.next().value ?? null}
						menu={entity}
					>{entity.currentDialog}</Selectable>

			}</Nineslice>
			: entity.cameraTarget
				? <PixelImage img={assets.ui.dialogIcon}></PixelImage>
				: <></>
	)
}