import { Color, ShaderMaterial, Uniform } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import vertexShader from './glsl/main.vert?raw'
import fragmentShader from './glsl/outline.frag?raw'

export const shader = new ShaderMaterial({ vertexShader, fragmentShader })

export class OutlineShader extends ShaderPass {
	constructor(color: Color = new Color(0xFFFFFF), opacity = 1) {
		super(shader.clone())
		this.uniforms.color = new Uniform([color.r, color.g, color.b, opacity])
		this.uniforms.size = new Uniform([32, 32])
	}
}
