import { ecs } from '@/global/init'

const playerQuery = ecs.with('playerInputMap', 'currentHealth')
export const battle = () => {
	for (const player of playerQuery) {
		if (player.playerInputMap.get('up').justPressed) {
			player.currentHealth--
		}
	}
}