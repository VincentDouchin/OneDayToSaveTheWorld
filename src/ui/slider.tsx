import { PixelImage } from './pixelImage'
import { Nineslice } from './nineslice'
import { context } from '@/global/context'
import { assets, ui } from '@/global/init'

export const Slider = (props: { get: () => number; set: (val: number) => void }) => {
	const handle = assets.ui.sliderHandle
	const value = ui.sync(props.get)
	return (
		<Nineslice img="sliderBar" margin={2}>
			<div style={{ padding: ` 0 ${handle.width * 0.5 * context.uiScale}rem` }}>
				<div style={{ width: `100%`, position: 'relative' }}>
					<div style={{ position: 'absolute', left: `${value()! * 100}%`, translate: '-50%' }}>
						<PixelImage img={handle}></PixelImage>
					</div>
					<input
						type="range"
						min="0"
						max="100"
						value={value()! * 100}
						onInput={(e) => {
							const target = e.target as HTMLInputElement
							props.set(target.valueAsNumber / 100)
						}}
					/>
				</div>
			</div>
		</Nineslice>

	)
}