import { Mesh, MeshBasicMaterial, OrthographicCamera, PlaneGeometry, Vector3 } from 'three'
import { ecs } from './init'
import { renderer, scene } from './rendering'

export const spawnCamera = () => {
	const w = window.innerWidth / 2
	const h = window.innerHeight / 2
	const camera = new OrthographicCamera(-w, w, h, -h, 0.1, 100)
	const t = new Mesh(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0xFF0000 }))
	t.position.set(0, 0, -1)
	scene.add(t)

	ecs.add({ camera, position: new Vector3(0, 0, 1) })
}

export const mainCameraQuery = ecs.with('camera')
export const sceneQuery = ecs.with('scene')
export const rendererQuery = ecs.with('renderer')
export const render = () => {
	const [{ camera }] = mainCameraQuery
	renderer.render(scene, camera)
}