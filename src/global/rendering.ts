import { LinearDisplayP3ColorSpace, LinearSRGBColorSpace, PCFSoftShadowMap, Scene, WebGLRenderer } from 'three'
import { ecs } from './init'

const initRenderer = (renderer: WebGLRenderer) => {
	renderer.setSize(window.innerWidth, window.innerHeight)
	document.body.appendChild(renderer.domElement)
}

export const scene = new Scene()
export const renderer = new WebGLRenderer({ alpha: true })
export const initThree = () => {
	// ! Scene
	ecs.add({ scene })
	// ! Renderer
	initRenderer(renderer)
	renderer.shadowMap.enabled = true
	renderer.shadowMap.type = PCFSoftShadowMap
	renderer.outputColorSpace = LinearSRGBColorSpace
	// renderer.setClearColor(0xFF0000, 0)
	// renderer.autoClear = false
	renderer.clear()
	ecs.add({ renderer })
}