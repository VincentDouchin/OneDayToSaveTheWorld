import { AmbientLight, DirectionalLight, PerspectiveCamera, Vector2, Vector3 } from 'three'
import { BattlerDirections, characterActions, characterCard, enemyHpBar } from './battleUi'
import { BattlerType, PlayerActions, battlerBundle, singleEnemyAttack } from './battlerBundle'
import { healthBundle } from './health'
import { mainCameraQuery } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { playerInputMap } from '@/global/inputMaps'
import { scene } from '@/global/rendering'
import { animationBundle } from '@/lib/animations'
import { Sprite } from '@/lib/sprite'
import { SelectedArrow, menuBundle } from '@/ui/menu'

export const spawnBattlers = () => {
	// ! Player
	ecs.add({
		position: new Vector3(-30, -15),
		...animationBundle('paladin', 'idle', 'right', 'down'),
		...healthBundle(20),
		...playerInputMap(),
		...battlerBundle(BattlerType.Player),
		battleActions: PlayerActions.paladin,
		size: new Vector2(6, 6),
		template: characterCard,
		shadow: true,
	})
	ecs.add({ template: characterActions, battlerMenu: true, ...menuBundle() })

	const light = new DirectionalLight(0xFFFFFF, 3)

	for (let i = 0; i < 50; i++) {
		const plants = [assets.battleSprites.herb1, assets.battleSprites.herb2, assets.battleSprites.herb3, assets.battleSprites.herb4]

		const flower = plants[Math.floor(Math.random() * plants.length)]
		const sprite = new Sprite(flower)
		ecs.add({
			sprite,
			position: new Vector3(Math.random() * 150 - 75, Math.random() * 70 - 50),
			size: new Vector2(flower.image.width, flower.image.height),
		})
	}
	// let j = 0
	// for (const y of [20, 30, 40]) {
	// 	ecs.add({
	// 		sprite: new Sprite(assets.battleSprites.trees),
	// 		position: new Vector3(j % 2 === 0 ? 8 : 0, y),
	// 		size: new Vector2(30, 30),
	// 	})
	// 	j++
	// }

	light.castShadow = true
	light.position.set(-40, -100, 100)
	// light.target = player.sprite
	light.shadow.camera.near = 0.01
	light.shadow.camera.far = 1000
	light.shadow.bias = 0.0001
	light.shadow.camera.left = -100
	light.shadow.camera.right = 100
	light.shadow.camera.top = 100
	light.shadow.camera.bottom = -100
	scene.add(light)
	scene.add(new AmbientLight(0xFFFFFF, 1))
	const enemies = ['bat', 'wolf', 'bat'] as const
	const menu = ecs.add({ ...menuBundle(), targetSelectorMenu: true, template: entity => SelectedArrow({ entity }) })
	for (let i = 0; i < enemies.length; i++) {
		const enemyName = enemies[i]
		ecs.add({
			...animationBundle(enemyName, 'idle', 'left', 'down'),
			...healthBundle(5),
			...battlerBundle(BattlerType.Enemy),
			position: new Vector3(30, [0, -15, -30][i]),
			uiPosition: new Vector3(20, 5, 0),
			battleActions: [singleEnemyAttack('attack')],
			template: enemyHpBar(menu, i),
			name: enemyName,
			size: new Vector2(6, 6),
		})
	}
	ecs.add({ template: BattlerDirections(menu) })
}

export const setSpritesForward = () => ecs.with('forward', 'sprite', 'size').onEntityAdded.subscribe((entity) => {
	const [{ camera }] = mainCameraQuery
	if (camera instanceof PerspectiveCamera) {
		const angle = camera.rotation.x
		entity.sprite.rotation.x = angle
		entity.sprite.castShadow = true
		entity.sprite.position.z = Math.sin(angle) * entity.size.y / 2
	}
})