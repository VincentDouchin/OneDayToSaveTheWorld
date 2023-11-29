import { Vector3 } from 'three'
import { BattlerType, PlayerActions, battlerBundle } from './battlerBundle'
import { healthBundle } from './health'
import { battles } from '@/constants/battles'
import { ecs } from '@/global/init'
import { menuInputMap } from '@/global/inputMaps'
import { save } from '@/global/save'
import type { battleRessources } from '@/global/states'
import { characterAnimationBundle } from '@/lib/animations'
import { characterSoundsBundle } from '@/lib/soundEffects'
import type { System } from '@/lib/state'

export const battleBackgroundQuery = ecs.with('battleBackground')
export const spawnBattlers: System<battleRessources> = ({ battle }) => {
	const battleData = battles[battle]
	const battleBackground = battleBackgroundQuery.first
	if (!battleBackground) return
	// ! Player
	for (const player of save.teams[save.currentTeam].players) {
		ecs.add({
			parent: battleBackground,
			position: new Vector3(-30, 0),
			...characterAnimationBundle(player.character, 'idle', 'right', 'down'),
			currentHealth: player.currentHealth,
			maxHealth: player.maxHealth,
			...menuInputMap(),
			...battlerBundle(BattlerType.Player),
			...characterSoundsBundle(player.character),
			battleActions: PlayerActions[player.character](),
			shadow: true,

		})
	}

	for (let i = 0; i < battleData.enemies.length; i++) {
		const enemy = battleData.enemies[i]
		const enemyName = enemy.atlas
		ecs.add({
			parent: battleBackground,
			...characterAnimationBundle(enemyName, 'idle', 'left', 'down'),
			...healthBundle(5),
			...battlerBundle(BattlerType.Enemy),
			position: new Vector3(30, [15, 0, -15][i]),
			uiPosition: new Vector3(20, 5, 0),
			battleActions: enemy.actions,
			name: enemyName,
			shadow: true,
		})
	}
}
