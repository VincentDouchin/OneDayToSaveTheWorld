import type { ModuleFactory } from 'material-composer'
import * as Modules from 'material-composer/modules'
import { between } from 'randomish'
import type { Input } from 'shader-composer'
import { Mul, Sin, UV } from 'shader-composer'
import { Color, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three'
import { InstancedParticles, ParticleAttribute, createParticleLifetime } from 'vfx-composer'
import type { Entity } from '@/global/entity'

interface ScaleXYProps {
	scale: Input<'vec3'>
}

export const ScaleXY: ModuleFactory<ScaleXYProps> = ({ scale = new Vector3() }) => state => ({
	...state,
	position: Mul(state.position, scale),
})

export const godRayBundle = (range: () => number): Entity => {
	const lifetime = createParticleLifetime()
	const scale = ParticleAttribute(new Vector3(1, 1, 1))
	const velocity = ParticleAttribute(new Vector3(0, 0, 0))
	const color = ParticleAttribute(new Color(0xFFFFCC))
	const modules = [
		Modules.Alpha({ alpha: Mul(Mul(Sin(Mul(lifetime.progress, Math.PI)), UV.y), 0.5) }),
		Modules.Lifetime(lifetime),
		Modules.Velocity({ direction: velocity, time: lifetime.age }),
		Modules.Color({ color }),
		ScaleXY({ scale }),
	]
	return {
		emitter: new InstancedParticles(
			new PlaneGeometry(10, 100),
			new MeshBasicMaterial({ transparent: true, opacity: 0.5 }),
			1000,
		),
		amount: () => Math.random() < 0.03 ? 1 : 0,
		modules,
		emit({ mesh, position, rotation }) {
			rotation.z = 0.2
			color.write(mesh, v => v.setRGB(1, 1, between(0.3, 0.7)))

			velocity.write(mesh, v => v.set(Math.cos(0.2), Math.sin(0.2), 0).multiplyScalar(between(-10, 10)))
			scale.write(mesh, v => v.set(between(0, 1), between(0.7, 1), 0))
			position.set(range(), 0, 0)

			lifetime.write(mesh, between(2, 5))
		},
	}
}