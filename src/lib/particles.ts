import type { Module } from 'material-composer'
import { compileModules, patchMaterial } from 'material-composer'
import { compileShader } from 'shader-composer'
import type { InstanceSetupCallback, InstancedParticles } from 'vfx-composer'
import type { State } from './state'
import { mainCameraQuery, rendererQuery, sceneQuery } from '@/global/camera'
import type { Entity } from '@/global/entity'
import { ecs, time } from '@/global/init'

const shaderMetaQuery = ecs.with('shaderMeta')
const updateShaderMeta = () => {
	for (const { shaderMeta } of shaderMetaQuery) {
		const [{ camera }] = mainCameraQuery
		const [{ scene }] = sceneQuery
		const [{ renderer }] = rendererQuery
		shaderMeta.update(time.deltaSeconds, camera, scene, renderer)
	}
}
const particlesQuery = ecs.with('emitter', 'emit', 'amount')

const spawnParticles = () => {
	for (const { emitter, amount, emit } of particlesQuery) {
		emitter.emit(amount(), emit)
	}
}
const compileShaders = () => ecs.with('modules', 'emitter').onEntityAdded.subscribe((entity) => {
	const { modules, emitter } = entity
	const root = compileModules(modules)
	const [shader, shaderMeta] = compileShader(root)
	if (!Array.isArray(emitter.material)) {
		patchMaterial(emitter.material, shader)
	}
	ecs.addComponent(entity, 'shaderMeta', shaderMeta)
})
export const particlesPlugin = (state: State) => {
	state
		.addSubscriber(compileShaders)
		.onUpdate(spawnParticles, updateShaderMeta)
}
export const particleBundle = ({ emitter, modules, amount, emit }: { emit: InstanceSetupCallback; amount: () => number; emitter: InstancedParticles; modules: Module[] }): Entity => {
	return { emitter, modules, amount, emit }
}
