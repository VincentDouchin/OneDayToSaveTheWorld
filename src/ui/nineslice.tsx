import type { VNode } from 'inferno'
import type { StandardProperties } from 'csstype'
import { assets } from '@/global/init'
import { styles } from '@/lib/ui'

export type margins = number | { x: number; y: number } | { top: number; bottom: number; right: number; left: number }

const getMargins = (margins: margins) => {
	if (typeof margins === 'number') {
		return { left: margins, right: margins, top: margins, bottom: margins }
	} else if ('x' in margins) {
		return { top: margins.y, bottom: margins.y, left: margins.x, right: margins.x }
	} else {
		return margins
	}
}

export const Nineslice = (props: { img: ui;margin: number; children?: VNode | VNode[]; scale?: number; style?: Partial<StandardProperties> }) => {
	const m = getMargins(props.margin)
	const allMargins = [m.top, m.right, m.left, m.bottom]
	const style = styles({
		borderImage: `url(${assets.ui[props.img].src}) round`,
		borderImageSlice: `${allMargins.join(' ')} fill`,
		borderImageRepeat: 'round',
		imageRendering: 'pixelated',
		borderWidth: allMargins.map(border => `${border * (props.scale ?? 1)}px`).join(' '),
		borderStyle: 'solid',
		...props.style,
	})
	return (
		<div style={style}>
			{props.children}
		</div>
	)
}
