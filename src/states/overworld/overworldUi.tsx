import { createSignal } from 'solid-js'
import { assets } from '@/global/init'
import { save, updateSave } from '@/global/save'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { Slider } from '@/ui/slider'
import { overWorldState } from '@/global/states'
import { StateUi } from '@/ui/state'

export const OverworldUi = () => {
	const [selected, setSelected] = createSignal(false)
	const [settingsMenu, setSettingsMenu] = createSignal(false)

	return (
		<StateUi state={overWorldState}>
			<Nineslice
				img="itemspot"
				margin={3}
				style={{ 'position': 'fixed', 'right': 0, 'top': 0, 'pointer-events': 'all', 'margin': '6rem' }}
			>
				<div
					onPointerEnter={() => setSelected(true)}
					onPointerLeave={() => setSelected(false)}
					onClick={() => setSettingsMenu(!settingsMenu())}
				>
					<PixelImage
						img={selected() ? assets.ui['setting-selected'] : assets.ui.setting}
					/>
				</div>
			</Nineslice>
			{settingsMenu() && (
				<Nineslice
					img="frameornate"
					margin={12}
					style={{ 'width': 'fit-content', 'min-width': '30rem', 'height': '80vh', 'margin': '4rem auto', 'pointer-events': 'all' }}
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
		</StateUi>
	)
}
