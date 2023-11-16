import type { Camera } from 'three'
import { Raycaster, Vector2 } from 'three'

export class PointersManager {
	#all = new Map<string | number, Pointer>()
	updatePointer(key: string | number, state: pointerState, event: MouseEvent | Touch) {
		const mouse = this.#all.get(key)
		if (mouse) {
			mouse.update(state, event)
		} else {
			this.#all.set(key, new Pointer(state, event))
		}
	}

	constructor() {
		for (const [mouseEvent, state] of [['mousedown', 'down'], ['mousemove', 'move'], ['mouseup', 'up']] as const) {
			window.addEventListener(mouseEvent, (e) => {
				this.updatePointer('mouse', state, e)
			})
		}
		for (const [touchEvent, state] of [['touchstart', 'down'], ['touchmove', 'move'], ['touchend', 'up']] as const) {
			window.addEventListener(touchEvent, (e) => {
				for (const touch of e.changedTouches) {
					this.updatePointer(touch.identifier, state, touch)
				}
			})
		}
	}

	*[Symbol.iterator]() {
		for (const value of this.#all.values()) {
			yield value
		}
	}

	update(camera?: Camera, element?: HTMLElement) {
		for (const pointer of this) {
			pointer.wasPressed = pointer.pressed
			pointer.pressed = pointer.state === 'down'
			if (camera && element) {
				const bounds = element?.getBoundingClientRect()
				const x = ((pointer.lastEvent.clientX - bounds.left) / element.clientWidth) * 2 - 1
				const y = 1 - ((pointer.lastEvent.clientY - bounds.top) / element.clientHeight) * 2
				pointer.ray.setFromCamera(new Vector2(x, y), camera)
			}
		}
	}
}
type pointerState = 'down' | 'move' | 'up'
class Pointer {
	pressed = false
	wasPressed = false
	lastEvent: MouseEvent | Touch
	state: pointerState
	start: MouseEvent | Touch | null = null
	ray = new Raycaster()
	constructor(state: pointerState, event: MouseEvent | Touch) {
		this.lastEvent = event
		this.state = state
	}

	update(state: pointerState, event: MouseEvent | Touch) {
		this.lastEvent = event
		this.state = state
		if (state === 'down') {
			this.start = event
		}
		if (state === 'up') {
			this.start = null
		}
	}
}