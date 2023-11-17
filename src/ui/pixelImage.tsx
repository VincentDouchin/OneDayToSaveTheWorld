import { context } from '@/global/context'

export const PixelImage = (props: { img: HTMLImageElement }) => <img draggable={false} src={props.img.src} style={{ width: `${props.img.width * context.uiScale}rem` }}></img>
