import { Acceleration, Color as ColorModule, Lifetime, Scale, Velocity } from 'material-composer/modules'
import { between, plusMinus, upTo } from 'randomish'
import { OneMinus } from 'shader-composer'
import { Color, MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three'
import { InstancedParticles, ParticleAttribute, createParticleLifetime } from 'vfx-composer'
import { Timer } from '@/lib/time'
import type { Entity } from '@/global/entity'

export const damageEffectBundle = (time: number): Entity => {
	const velocity = ParticleAttribute(new Vector3())
	const color = ParticleAttribute(new Color())
	const lifetime = createParticleLifetime()
	const modules = [
		ColorModule({ color }),
		Scale({ scale: OneMinus(lifetime.progress) }),
		Velocity({
			direction: velocity,
			time: lifetime.age,
		}),
		Acceleration({
			direction: new Vector3(0, 0, 0),
			time: lifetime.age,
		}),
		Lifetime(lifetime),
	]
	return {
		emitter: new InstancedParticles(new PlaneGeometry(1, 1), new MeshBasicMaterial({ color: 0xFF0000 }), 1000),
		modules,
		amount: () => Math.random() < 0.5 ? 1 : 0,
		emit({ mesh, position }) {
			position.randomDirection().multiplyScalar(upTo(8))
			color.write(mesh, v => v.setRGB(between(0.5, 1), 0, 0))
			lifetime.write(mesh, between(5, 10))
			velocity.write(mesh, value => value.set(plusMinus(between(5, 10)), between(3, 6), 0))
		},
		deathTimer: new Timer(time),
	}
}