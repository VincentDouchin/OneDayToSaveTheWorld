import { Box2, OrthographicCamera, Vector2, Vector3 } from 'three'
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass'
import { ecs } from './init'
import type { Level } from '@/levels/LDTKMap'
import { throttle } from '@/lib/state'
import { VignetteShader } from '@/shaders/VignetteShader'

export const cameraBoundsFromLevel = (level: Level) => {
	const w = level.pxWid / 2
	const h = level.pxHei / 2
	return { cameraBounds: new Box2(new Vector2(-w, -h), new Vector2(w, h)) }
}

export const mainCameraQuery = ecs.with('camera', 'position', 'mainCamera')
export const sceneQuery = ecs.with('scene')
export const rendererQuery = ecs.with('renderer')
export const cssRendererQuery = ecs.with('cssRenderer')
export const composerQuery = ecs.with('composer')
export const spawnCamera = () => {
	const w = window.innerWidth / 2
	const h = window.innerHeight / 2
	const camera = new OrthographicCamera(-w, w, h, -h, 0.1, 1000)
	ecs.add({ camera, mainCamera: true, position: new Vector3(0, 0, 100) })
	const composer = composerQuery.first
	const scene = sceneQuery.first
	if (composer && scene) {
		composer.composer.addPass(new RenderPass(scene.scene, camera))
		composer.composer.addPass(new VignetteShader())
	}
}

export const render = () => {
	const camera = mainCameraQuery.first
	const renderer = rendererQuery.first
	const cssRenderer = cssRendererQuery.first
	const composer = composerQuery.first
	const scene = sceneQuery.first
	if (camera && renderer && scene && cssRenderer && composer) {
		renderer.renderer.render(scene.scene, camera.camera)
		composer.composer.render()
		cssRenderer.cssRenderer.render(scene.scene, camera.camera)
	}
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
	const cameraBoundsQuery = ecs.with('position', 'cameraBounds')

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
		for (const { cameraBounds } of cameraBoundsQuery) {
			zoom = window.innerWidth / (cameraBounds.max.x - cameraBounds.min.x)
		}
		for (const { camera } of mainCameraQuery) {
			if (zoom && camera instanceof OrthographicCamera) {
				camera.zoom = zoom
				camera.updateProjectionMatrix()
			}
		}
	})
}
