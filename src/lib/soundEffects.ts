import type { State } from './state'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { save } from '@/global/save'
import { getRandom } from '@/utils/mapFunctions'

export const characterSoundsBundle = <C extends keyof soundEffects>(character: C): Entity => {
	const getSoundsMap = (name: string) => (<[string, Howl][]>Object.entries(assets.sounds[character])).reduce<Howl[]>((acc, [key, val]) => key.includes(name) ? [...acc, val] : acc, [])
	return {
		sounds: {
			dmg: getSoundsMap('damage'),
			die: getSoundsMap('death'),
			walk: getSoundsMap('walk'),
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
		}
	}
}
const playSoundEffect = () => ecs.with('currentSoundEffect').onEntityAdded.subscribe((entity) => {
	entity.currentSoundEffect.play()
	entity.currentSoundEffect.on('end', () => {
		ecs.removeComponent(entity, 'currentSoundEffect')
	})
})
export const soundEffectsPlugin = (state: State) => {
	state
		.addSubscriber(playSoundEffect)
		.onUpdate(setCurrentSoundEffect)
}

export const setGlobalVolume = () => {
	Howler.volume(save.settings.volume)
}