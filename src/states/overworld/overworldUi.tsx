import { assets, ecs } from '@/global/init'
import { save, updateSave } from '@/global/save'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { Slider } from '@/ui/slider'

const playerQuery = ecs.with('menuInputMap')

export const overworldUi = () => {
	let selected = false
	let settingsMenu = false
	const openSettingsMenu = () => {
		settingsMenu = !settingsMenu
	}
	return () => {
		if (playerQuery.first?.menuInputMap.get('cancel').justPressed) {
			openSettingsMenu()
		}
		return (
			<>
				<Nineslice
					img="itemspot"
					margin={3}
					style={{ position: 'fixed', right: 0, top: 0, pointerEvents: 'all', margin: '6rem' }}
				>
					<div
						onPointerEnter={() => selected = true}
						onPointerLeave={() => selected = false}
						onClick={openSettingsMenu}
					>
						<PixelImage
							img={selected ? assets.ui['setting-selected'] : assets.ui.setting}
						/>
					</div>
				</Nineslice>
				{settingsMenu && (
					<Nineslice
						img="frameornate"
						margin={12}
						style={{ width: 'fit-content', minWidth: '30rem', height: '80vh', margin: '4rem auto', pointerEvents: 'all' }}
					>
						<div>Volume</div>
						<Slider
							get={() => save.settings.volume}
							set={(vol) => {
								Howler.volume(vol)
								updateSave(s => s.settings.volume = vol)
							}}
						/>
					</Nineslice>
				)}
			</>
		)
	}
}

export const spawnOverWorldUi = () => {
	ecs.add({
		template: overworldUi(),
	})
}
