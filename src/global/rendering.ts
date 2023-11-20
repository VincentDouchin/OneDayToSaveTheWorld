import { LinearSRGBColorSpace, PCFSoftShadowMap, Scene, WebGLRenderer } from 'three'
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import { CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import { ecs } from './init'

const initRenderer = (renderer: WebGLRenderer | CSS2DRenderer) => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
}

export const scene = new Scene()
export const renderer = new WebGLRenderer({ alpha: true })
export const composer = new EffectComposer(renderer)
export const cssRenderer = new CSS2DRenderer()
export const initThree = () => {
	// ! Scene
	ecs.add({ scene })
	// ! Renderer
	initRenderer(renderer)
	initRenderer(cssRenderer)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = PCFSoftShadowMap
	renderer.outputColorSpace = LinearSRGBColorSpace
	renderer.autoClear = false
	renderer.clear()
	cssRenderer.domElement.style.position = 'fixed'
	cssRenderer.domElement.style.left = '0'
	cssRenderer.domElement.style.top = '0'
	cssRenderer.domElement.style.imageRendering = 'pixelated'
	cssRenderer.domElement.style.pointerEvents = 'none'

	ecs.add({ renderer })
	ecs.add({ composer })
	ecs.add({ cssRenderer })
}