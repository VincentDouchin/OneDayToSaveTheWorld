import { type JSX, createMemo } from 'solid-js'
import { context } from '@/global/context'
import { assets } from '@/global/init'

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

export const Nineslice = (props: { img: ui; margin: margins; children?: JSX.Element; style?: JSX.CSSProperties }) => {
	const m = getMargins(props.margin)
	const allMargins = [m.top, m.right, m.left, m.bottom]
	const style = createMemo<JSX.CSSProperties>(() => ({
		...props.style,
		'border-image': `url(${assets.ui[props.img].src}) ${allMargins.join(' ')} fill / 1 / 0 round`,
		'border-image-repeat': 'round',
		'image-rendering': 'pixelated',
		'border-width': allMargins.map(border => `${border * (context.uiScale)}rem`).join(' '),
		'border-style': 'solid',
	}))
	return (
		<div style={style()} class="ok">
			{props.children}
		</div>
	)
}
