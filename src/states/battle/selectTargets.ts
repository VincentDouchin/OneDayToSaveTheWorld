import { Color } from 'three'
import { ecs } from '@/global/init'
import { OutlineShader } from '@/shaders/OutlineShader'

const targetQuery = ecs.with('target', 'sprite')

const selectTargets = () => targetQuery.onEntityAdded.subscribe((entity) => {
	entity.sprite.composer.addPass(new OutlineShader(new Color(0xFFFFFF)))
})
const unselectTargets = () => targetQuery.onEntityRemoved.subscribe((entity) => {
	entity.sprite.composer.removePass(OutlineShader)
})
export const targetSelection = [selectTargets, unselectTargets]

// for (const menu of targetSelectorMenuQuery) {
// 	const [{ camera }] = mainCameraQuery
// 	const [{ renderer }] = rendererQuery
// 	for (const ray of pointers.rays(camera, renderer.domElement)) {
// 		for (const target of menu.entityMenu) {
// 			if (target.sprite) {
// 				const intersect = ray.intersectObject(target.sprite)[0]
// 				if (intersect?.uv) {
// 					const texture = target.sprite.composer.initialTarget.texture
// 					const w = texture.image.width
// 					const h = texture.image.height
// 					const { x: ux, y: uy } = intersect.uv
// 					const data = texture.image.getContext('2d').getImageData(0, 0, w, h).data
// 					const x = Math.round(ux * w)
// 					const y = h - Math.round(uy * h)
// 					const i = (x + y * w) * 4
// 					const a = data[i + 3]
// 					if (a) {
// 						!target.selected && addTag(target, 'selected')
// 					} else {
// 						ecs.removeComponent(target, 'selected')
// 					}
// 				}
// 			}
// 		}
// 	}
// }
