import { InputMap } from '@/lib/inputs'

const playerInputs = ['up', 'down', 'left', 'right'] as const
export type PlayerInputs = typeof playerInputs[number]
export const playerInputMap = () => {
	const map = new InputMap(playerInputs)
	map.get('up').setKeys('KeyW')
	map.get('down').setKeys('KeyS')
	map.get('left').setKeys('KeyA')
	map.get('right').setKeys('KeyD')
	return { playerInputMap: map }
}