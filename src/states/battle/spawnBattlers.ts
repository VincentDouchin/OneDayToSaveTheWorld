import { AmbientLight, DirectionalLight, Vector3 } from 'three'
import { perspectiveCam } from '@/global/camera'
import { assets, ecs } from '@/global/init'
import { scene } from '@/global/rendering'
import { animationBundle } from '@/lib/animations'
import { Sprite } from '@/lib/sprite'

const setAngle = (sprite: Sprite, height: number, angle: number = perspectiveCam.rotation.x) => {
	sprite.rotation.x = angle
	sprite.castShadow = true
	sprite.position.z = Math.sin(angle) * height / 2
}
export const spawnBattlers = () => {
	const player = ecs.add({
		...animationBundle('paladin', 'idle', 'right', 'down'),
		position: new Vector3(-30, -20),
	})
	const light = new DirectionalLight(0xFFFFFF, 3)

	for (let i = 0; i < 30; i++) {
		const plants = [assets.battleSprites.herb1, assets.battleSprites.herb2, assets.battleSprites.herb3, assets.battleSprites.herb4]

		const flower = plants[Math.floor(Math.random() * plants.length)]
		const sprite = new Sprite(flower)
		setAngle(sprite, flower.image.height)
		ecs.add({
			sprite,
			position: new Vector3(Math.random() * 150 - 75, Math.random() * 50 - 40),
		})
	}
	let j = 0
	for (const y of [20, 30, 40]) {
		const trees = ecs.add({
			sprite: new Sprite(assets.battleSprites.trees),
			position: new Vector3(j % 2 === 0 ? 8 : 0, y),
		})
		j++
		setAngle(trees.sprite, 30)
	}
	setAngle(player.sprite, 6)

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
	let i = 0
	for (const enemyName of ['bat', 'wolf', 'bat'] as const) {
		const enemy = ecs.add({
			...animationBundle(enemyName, 'idle', 'left', 'down'),
			position: new Vector3(30, [-50, -25, 0][i]),
		})
		i++
		setAngle(enemy.sprite, 6)
	}
}