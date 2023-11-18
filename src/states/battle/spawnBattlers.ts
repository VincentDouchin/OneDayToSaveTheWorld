import { Vector2, Vector3 } from 'three'
import { BattlerDirections, characterActions, characterCard, enemyHpBar } from './battleUi'
import { BattlerType, PlayerActions, battlerBundle, singleEnemyAttack } from './battlerBundle'
import { healthBundle } from './health'
import { ecs } from '@/global/init'
import { playerInputMap } from '@/global/inputMaps'
import { characterAnimationBundle } from '@/lib/animations'
import { characterSoundsBundle } from '@/lib/soundEffects'
import { SelectedArrow, menuBundle } from '@/ui/menu'
import type { System } from '@/lib/state'
import type { battleRessources } from '@/global/states'
import { battles } from '@/constants/battles'

const battleBackgroundQuery = ecs.with('battleBackground')
export const spawnBattlers: System<battleRessources> = ({ battle }) => {
	const battleData = battles[battle]
	const battleBackground = battleBackgroundQuery.first
	if (!battleBackground) return
	// ! Player
	ecs.add({
		parent: battleBackground,
		position: new Vector3(-30, 0),
		...characterAnimationBundle('paladin', 'idle', 'right', 'down'),
		...healthBundle(20),
		...playerInputMap(),
		...battlerBundle(BattlerType.Player),
		...characterSoundsBundle('paladin'),
		battleActions: PlayerActions.paladin,
		size: new Vector2(6, 6),
		template: characterCard,
		shadow: true,

	})
	ecs.add({
		parent: battleBackground,
		template: characterActions,
		battlerMenu: true,
		...menuBundle(),
	})

	const menu = ecs.add({ ...menuBundle(), targetSelectorMenu: true, template: entity => SelectedArrow({ entity }) })
	for (let i = 0; i < battleData.enemies.length; i++) {
		const enemyName = battleData.enemies[i].atlas
		ecs.add({
			parent: battleBackground,
			...characterAnimationBundle(enemyName, 'idle', 'left', 'down'),
			...healthBundle(5),
			...battlerBundle(BattlerType.Enemy),
			position: new Vector3(30, [15, 0, -15][i]),
			uiPosition: new Vector3(20, 5, 0),
			battleActions: [singleEnemyAttack('attack')],
			template: enemyHpBar(menu, i),
			name: enemyName,
			size: new Vector2(6, 6),
			shadow: true,
			...characterSoundsBundle(enemyName),
		})
	}
	ecs.add({
		parent: battleBackground,
		template: BattlerDirections(menu),
	})
}
