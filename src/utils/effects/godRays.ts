import { InstancedParticles, ParticleAttribute } from 'vfx-composer'
import { MeshBasicMaterial, PlaneGeometry, Vector3 } from 'three'
import { between } from 'randomish'
import * as Modules from 'material-composer/modules'
import { ecs } from '@/global/init'

const battleBackgroundQuery = ecs.with('battleBackground')
export const spawnGodRays = () => {
	const battleBackground = battleBackgroundQuery.first
	if (battleBackground) {
		const opacity = ParticleAttribute(0)
		const modules = [Modules.Alpha({ alpha: opacity })]
		ecs.add({
			emitter: new InstancedParticles(
				new PlaneGeometry(10, 100),
				new MeshBasicMaterial({ opacity: 0.5 }),
				1000,
			),
			amount: () => between(0, 1),
			modules,
			emit({ mesh, position }) {

			},
			parent: battleBackground,
			position: new Vector3(),
		})
	}
}