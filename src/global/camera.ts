import { Box2, OrthographicCamera, PerspectiveCamera, Vector2, Vector3 } from 'three'
import { ecs } from './init'
import { cssRenderer, scene } from './rendering'
import { throttle } from '@/lib/state'
import type { Level } from '@/levels/LDTKMap'

export const cameraBoundsFromLevel = (level: Level) => {
	const w = level.pxWid / 2
	const h = level.pxHei / 2
	return { cameraBounds: new Box2(new Vector2(-w, -h), new Vector2(w, h)) }
}

export const spawnCamera = () => {
	// const w = window.innerWidth / 2
	// const h = window.innerHeight / 2
	// const camera = new OrthographicCamera(-w, w, h, -h, 0.1, 1000)
	// ecs.add({ camera, mainCamera: true, position: new Vector3(0, 0, 1) })
	const perspectiveCam = new PerspectiveCamera(50, window.innerWidth / window.innerHeight, 0.01, 1000)
	scene.add(perspectiveCam)
	perspectiveCam.position.set(0, -200, 100)
	perspectiveCam.zoom = 3
	perspectiveCam.updateProjectionMatrix()
	perspectiveCam.lookAt(new Vector3())
	ecs.add({ camera: perspectiveCam, mainCamera: true, position: new Vector3() })
}

export const mainCameraQuery = ecs.with('camera', 'position', 'mainCamera')
export const sceneQuery = ecs.with('scene')
export const rendererQuery = ecs.with('renderer')

export const render = () => {
	const [{ camera }] = mainCameraQuery
	const [{ renderer }] = rendererQuery
	const [{ scene }] = sceneQuery
	renderer.render(scene, camera)
	cssRenderer.render(scene, camera)
}
const boundsQuery = ecs.with('cameraBounds')
const cameraTargetQuery = ecs.with('position', 'cameraTarget')
export const moveCamera = () => {
	for (const { position, camera } of mainCameraQuery) {
		if (camera instanceof OrthographicCamera) {
			for (const target of cameraTargetQuery) {
				position.x = target.position.x
				position.y = target.position.y
			}
			for (const { cameraBounds } of boundsQuery) {
				position.x = Math.max(Math.min(cameraBounds.max.x + camera.left / camera.zoom, position.x), cameraBounds.min.x + camera.right / camera.zoom)
				position.y = Math.max(Math.min(cameraBounds.max.y + camera.bottom / camera.zoom, position.y), cameraBounds.min.y + camera.top / camera.zoom)
			}
		}
	}
}
export const adjustScreenSize = () => {
	const screenSize = { x: window.innerWidth, y: window.innerHeight / 2, changed: false }
	window.addEventListener('resize', () => {
		screenSize.x = window.innerWidth
		screenSize.y = window.innerHeight
		screenSize.changed = true
	})
	const cameraBoundsQuery = ecs.with('sprite', 'position', 'cameraBounds')

	return throttle(100, () => {
		if (screenSize.changed) {
			for (const { renderer } of rendererQuery) {
				renderer.setSize(window.innerWidth, window.innerHeight)
			}
			for (const { camera } of mainCameraQuery) {
				if (camera instanceof OrthographicCamera) {
					camera.left = -window.innerWidth / 2
					camera.right = window.innerWidth / 2
					camera.bottom = -window.innerHeight / 2
					camera.top = window.innerHeight / 2
				}
			}
		}

		let zoom: null | number = null
		for (const { sprite } of cameraBoundsQuery) {
			zoom = window.innerWidth / sprite.scaledDimensions.x
		}
		for (const { camera } of mainCameraQuery) {
			if (zoom && camera instanceof OrthographicCamera) {
				camera.zoom = zoom
				camera.updateProjectionMatrix()
			}
		}
	})
}
