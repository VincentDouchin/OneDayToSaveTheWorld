import { ShaderMaterial, Uniform } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from './glsl/main.vert?raw'
import fragmentShader from './glsl/itemPickup.frag?raw'

export const shader = new ShaderMaterial({ vertexShader, fragmentShader })

export class ItemPickupShader extends ShaderPass {
	constructor(radius = 1) {
		super(shader.clone())
		this.uniforms.radius = new Uniform(radius)
	}
}
