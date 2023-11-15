import { AmbientLight, Vector2, Vector3 } from 'three'
import { BattlerDirections, characterActions, characterCard, enemyHpBar } from './battleUi'
import { BattlerType, PlayerActions, battlerBundle, singleEnemyAttack } from './battlerBundle'
import { healthBundle } from './health'
import { ecs } from '@/global/init'
import { playerInputMap } from '@/global/inputMaps'
import { scene } from '@/global/rendering'
import { characterAnimationBundle } from '@/lib/animations'
import { SelectedArrow, menuBundle } from '@/ui/menu'
import { characterSoundsBundle } from '@/lib/soundEffects'
export const spawnBattlers = () => {
	// ! Player
	ecs.add({
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
	ecs.add({ template: characterActions, battlerMenu: true, ...menuBundle() })

	scene.add(new AmbientLight(0xFFFFFF, 3))
	const enemies = ['bat', 'wolf', 'bat'] as const
	const menu = ecs.add({ ...menuBundle(), targetSelectorMenu: true, template: entity => SelectedArrow({ entity }) })
	for (let i = 0; i < enemies.length; i++) {
		const enemyName = enemies[i]
		ecs.add({
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
	ecs.add({ template: BattlerDirections(menu) })
}
