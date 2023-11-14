import { ecs } from '@/global/init'

const emissiveColorQuery = ecs.with('emissiveColor', 'sprite')
const emissiveIntensityQuery = ecs.with('emissiveIntensity', 'sprite')
const emissiveMapQuery = ecs.with('emissiveMap', 'sprite')
export const setUpEmissive = () => {
	for (const { emissiveColor, sprite } of emissiveColorQuery) {
		sprite.material.emissive = emissiveColor
	}
	for (const { emissiveIntensity, sprite } of emissiveIntensityQuery) {
		sprite.material.emissiveIntensity = emissiveIntensity
	}
	for (const { emissiveMap, sprite } of emissiveMapQuery) {
		sprite.material.emissiveMap = emissiveMap
	}
}