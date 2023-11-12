import type { Camera } from 'three'
import { Raycaster, Vector2 } from 'three'

export class PointersManager {
	#all = new Map<string | number, Touch | MouseEvent>()
	constructor() {
		for (const mouseEvent of ['mousedown', 'mousemove'] as const) {
			window.addEventListener(mouseEvent, (e) => {
				this.#all.set('mouse', e)
			})
		}
		window.addEventListener('mouseup', () => {
			this.#all.delete('mouse')
		})
		for (const touchEvent of ['touchmove', 'touchstart'] as const) {
			window.addEventListener(touchEvent, (e) => {
				for (const touch of e.changedTouches) {
					this.#all.set(touch.identifier, touch)
				}
			})
		}
		window.addEventListener('touchend', (e) => {
			for (const touch of e.changedTouches) {
				this.#all.delete(touch.identifier)
			}
		})
	}

	*[Symbol.iterator]() {
		for (const value of this.#all.values()) {
			yield value
		}
	}

	rays(camera: Camera, element: HTMLElement) {
		const rays: Raycaster[] = []
		const bounds = element.getBoundingClientRect()
		for (const pointer of this) {
			const ray = new Raycaster()
			const x = ((pointer.clientX - bounds.left) / element.clientWidth) * 2 - 1
			const y = 1 - ((pointer.clientY - bounds.top) / element.clientHeight) * 2
			ray.setFromCamera(new Vector2(x, y), camera)
			rays.push(ray)
		}
		return rays
	}
}
