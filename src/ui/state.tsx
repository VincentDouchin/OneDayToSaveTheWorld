import type { JSX } from 'solid-js/jsx-runtime'
import { ui } from '@/global/init'
import type { State } from '@/lib/state'

export const StateUi = (props: { state: State<any>; children: JSX.Element }) => {
	const isEnabled = ui.sync(() => props.state.enabled)
	return <>{isEnabled() ? props.children : <></>}</>
}