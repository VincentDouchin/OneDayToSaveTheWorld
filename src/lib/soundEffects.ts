import type { State } from './state'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { save } from '@/global/save'
import { getRandom } from '@/utils/mapFunctions'

export const characterSoundsBundle = <C extends keyof soundEffects>(character: C): Entity => {
	const getSoundsMap = (name: string, loop = false) => {
		const sounds = (<[string, Howl][]>Object.entries(assets.sounds[character]))
			.reduce<Howl[]>((acc, [key, val]) => key.includes(name) ? [...acc, val] : acc, [])
		if (loop) {
			sounds.forEach(s => s.loop(true))
		}
		return sounds
	}
	return {
		sounds: {
			dmg: getSoundsMap('damage'),
			die: getSoundsMap('death'),
			walk: getSoundsMap('walk', true),
		},
	}
}

const soundQuery = ecs.with('sounds', 'state')
const setCurrentSoundEffect = () => {
	for (const entity of soundQuery) {
		const { sounds, state } = entity
		if (state in sounds) {
			if ((entity.currentSoundEffect && !sounds[state].includes(entity.currentSoundEffect))) {
				entity.currentSoundEffect?.stop()
				ecs.removeComponent(entity, 'currentSoundEffect')
			}
			ecs.addComponent(entity, 'currentSoundEffect', getRandom(sounds[state]))
		} else {
			entity.currentSoundEffect?.stop()
			ecs.removeComponent(entity, 'currentSoundEffect')
		}
	}
}
const playSoundEffect = () => ecs.with('currentSoundEffect').onEntityAdded.subscribe((entity) => {
	entity.currentSoundEffect.play()
})
const stopSoundEffect = () => ecs.with('currentSoundEffect').onEntityRemoved.subscribe((entity) => {
	entity.currentSoundEffect.stop()
})
export const soundEffectsPlugin = (state: State) => {
	state
		.addSubscriber(playSoundEffect, stopSoundEffect)
		.onUpdate(setCurrentSoundEffect)
}

export const setGlobalVolume = () => {
	Howler.volume(save.settings.volume)
}