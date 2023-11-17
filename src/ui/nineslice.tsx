import type { StandardProperties } from 'csstype'
import type { ComponentChildren } from 'preact'
import { assets } from '@/global/init'
import { context } from '@/global/context'

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

export const Nineslice = (props: { img: ui; margin: margins; children?: ComponentChildren; style?: Partial<StandardProperties>; className?: string }) => {
	const m = getMargins(props.margin)
	const allMargins = [m.top, m.right, m.left, m.bottom]
	const style = {
		borderImage: `url(${assets.ui[props.img].src}) ${allMargins.join(' ')} fill / 1 / 0 round`,
		borderImageRepeat: 'round',
		imageRendering: 'pixelated',
		borderWidth: allMargins.map(border => `${border * (context.uiScale)}rem`).join(' '),
		borderStyle: 'solid',
		...props.style,
	}
	return (
		<div style={style} className={props.className}>
			{props.children}
		</div>
	)
}
