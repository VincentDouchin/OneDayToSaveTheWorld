import { InputMap } from '@/lib/inputs'

const playerInputs = ['up', 'down', 'left', 'right', 'interact'] as const
export type PlayerInputs = typeof playerInputs[number]
export const playerInputMap = () => {
	const map = new InputMap(playerInputs)
	map.get('up').setKeys('KeyW')
	map.get('down').setKeys('KeyS')
	map.get('left').setKeys('KeyA')
	map.get('right').setKeys('KeyD')
	map.get('interact').setKeys('Space', 'Enter')
	return { playerInputMap: map }
}
const menuInputs = ['up', 'down', 'left', 'right', 'validate', 'cancel'] as const
export type MenuInputs = typeof menuInputs[number]
export const menuInputMap = () => {
	const map = new InputMap(menuInputs)
	map.get('up').setKeys('KeyW')
	map.get('down').setKeys('KeyS')
	map.get('left').setKeys('KeyA')
	map.get('right').setKeys('KeyD')
	map.get('validate').setKeys('Space', 'Enter')
	map.get('cancel').setKeys('Backspace', 'Escape')
	return { menuInputMap: map }
}