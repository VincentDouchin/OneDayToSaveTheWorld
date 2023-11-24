import type { With } from 'miniplex'
import { useEffect, useState } from 'preact/hooks'
import { useSyncExternalStore } from 'preact/compat'
import type { Entity } from '@/global/entity'
import { assets, ecs, time } from '@/global/init'
import { Selectable } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { sleep } from '@/utils/sleep'
import { Timer } from '@/lib/time'

export const TypeWritter = (props: { children: string; currentIndex?: number }) => {
	return (
		<>
			{Array.from(props.children).map((letter, i) => <span style={{ opacity: i < (props.currentIndex ?? 0) ? 1 : 0 }}>{letter}</span>)}
		</>
	)
}
export const DialogUi = () => {
	// const [s, setS] = useState(0)
	return (
		<div>
			ok
		</div>
	)
}
// export const dialogUi = () => {
// 	// let timer: null | Timer = null
// 	// const stepDialog = (entity: With<Entity, 'dialog'>, index: number | void) => {
// 	// 	if (timer?.ticks && entity.currentDialog && timer?.ticks < entity.currentDialog?.length) {
// 	// 		timer.tick(Number.POSITIVE_INFINITY)
// 	// 		return
// 	// 	}
// 	// 	const nextDialog = entity.dialog.next(index).value
// 	// 	if (nextDialog) {
// 	// 		timer = new Timer(20)
// 	// 		entity.currentDialog = nextDialog
// 	// 	} else {
// 	// 		sleep(100).then(() => {
// 	// 			ecs.removeComponent(entity, 'cameraTarget')
// 	// 			ecs.removeComponent(entity, 'menu')
// 	// 			ecs.removeComponent(entity, 'currentDialog')
// 	// 		})
// 	// 	}
// 	// }
// 	console.log('ok')
// 	return () => {
// 		// timer?.tick(time.delta)
// 		// const entity = useSyncExternalStore(rerender, () => props)
// 		const [count, setCount] = useState(0)
// 		return <div>{count}</div>
// 		// if (entity.menu && !timer)timer = new Timer(20)
// 		// return (
// 		// 	(entity.menu)
// 		// 		? (
// 		// 			<Nineslice img="textbox" margin={5} style={{ translate: '0% -50%', maxWidth: '20rem', fontSize: '2rem', display: 'grid', gap: '0.5rem' }}>
// 		// 				{
// 		// 					 Array.isArray(entity.currentDialog)
// 		// 					 	? entity.currentDialog.map((text, index) => {
// 		// 					 		return (
// 		// 						<Selectable
// 		// 							tag={`text${index}`}
// 		// 							style={{ textDecoration: entity.selectedElement === `text${index}` ? 'underline' : '' }}
// 		// 							menu={entity}
// 		// 							onClick={() => stepDialog(entity, index)}
// 		// 						>
// 		// 							<TypeWritter currentIndex={timer?.ticks}>{text}</TypeWritter>
// 		// 						</Selectable>
// 		// 					 		) },
// 		// 					 	)
// 		// 					 	: (
// 		// 						<Selectable
// 		// 							tag="text"
// 		// 							onClick={() => stepDialog(entity)}
// 		// 							menu={entity}
// 		// 						>
// 		// 							<TypeWritter currentIndex={timer?.ticks}>{entity.currentDialog ?? ''}</TypeWritter>
// 		// 						</Selectable>
// 		// 					 		)

// 		// 	}
// 		// 			</Nineslice>
// 		// 			)
// 		// 		: entity.cameraTarget
// 		// 			? <PixelImage img={assets.ui.dialogIcon}></PixelImage>
// 		// 			: <></>
// 		// )
// 	}
// }