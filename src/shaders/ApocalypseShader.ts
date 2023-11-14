import { ShaderMaterial, Uniform } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'
import fragmentShader from './glsl/apocalypse.frag?raw'
import noise from './glsl/lib/cnoise.glsl?raw'
import vertexShader from './glsl/main.vert?raw'
import { Timer } from '@/lib/time'

export const colorShader = new ShaderMaterial({
	vertexShader,
	fragmentShader: `${noise}
${fragmentShader}`,
})

export class ApocalypseShader extends ShaderPass {
	timer = new Timer(10000)
	tick(time: number) {
		this.timer.tick(time)
		this.uniforms.time.value = this.timer.percentFinished
	}

	constructor() {
		super(colorShader.clone())

		this.uniforms.color = new Uniform([1, 0.2, 0.2, 0])
		this.uniforms.time = new Uniform(0)
	}
}
