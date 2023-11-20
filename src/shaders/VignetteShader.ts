import { ShaderMaterial } from 'three'
import { ShaderPass } from 'three/examples/jsm/postprocessing/ShaderPass'

const vignette = new ShaderMaterial({
	transparent: true,
	vertexShader: /* glsl */`
	varying vec2 vUv;
	void main() {
		vUv = uv;
		vec4 modelViewPosition = modelViewMatrix * vec4(position, 1.0);
		gl_Position = projectionMatrix * modelViewPosition;
	}`,
	fragmentShader: /* glsl */`
	varying vec2 vUv;
	void main() {
		vec2 vignetteUV = vUv;
		vignetteUV *=  1.0 - vUv.yx;   //vec2(1.0)- uv.yx; -> 1.-u.yx; Thanks FabriceNeyret !
		float vig = vignetteUV.x*vignetteUV.y * 15.0; // multiply with sth for intensity
		vig = pow(vig, 0.15); // change pow for modifying the extend of the  vignette
		gl_FragColor = vec4(0.,0.,0.,1. - vig);
	}`,

})
export class VignetteShader extends ShaderPass {
	constructor() {
		super(vignette.clone())
	}
}