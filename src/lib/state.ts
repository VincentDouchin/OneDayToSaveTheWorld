export type SystemFunction = () => void
export type EnterSystem = () => void | (() => void)
interface System extends SystemFunction {
	before?: System
	after?: System
}
export class StateMananger {
	#preUpdate = new Array<System>()
	#postUpdate = new Array<System>()
	#update = new Array<System>()
	#callBacks = new Map<State, Array<() => void>>()
	#addSystems(systems: System[], destination: System[]) {
		for (const system of systems) {
			if (system.before) {
				const index = destination.indexOf(system.before)
				if (index === -1) {
					destination.push(system)
				} else {
					destination.splice(index, 0, system)
				}
			} else if (system.after) {
				const index = destination.indexOf(system.after)
				if (index === -1) {
					destination.push(system)
				} else {
					destination.splice(index, 0, system)
				}
			} else {
				destination.push(system)
			}
		}
	}

	#removeSystems(systems: System[], source: System[]) {
		for (const system of systems) {
			source.splice(source.indexOf(system), 1)
		}
	}

	enable(state: State) {
		this.#addSystems(state._preUpdate, this.#preUpdate)
		this.#addSystems(state._postUpdate, this.#postUpdate)
		this.#addSystems(state._update, this.#update)
		const callBacks = new Array<() => void>()
		for (const system of state._enter) {
			const callBack = system()
			if (callBack) {
				callBacks.push(callBack)
			}
		}
		if (callBacks.length > 0) {
			this.#callBacks.set(state, callBacks)
		}
	}

	disable(state: State) {
		this.#removeSystems(state._preUpdate, this.#preUpdate)
		this.#removeSystems(state._postUpdate, this.#postUpdate)
		this.#removeSystems(state._update, this.#update)
		const callBacks = this.#callBacks.get(state)
		if (callBacks) {
			for (const callBack of callBacks) {
				callBack()
			}
		}
		for (const system of state._exit) {
			system()
		}
	}

	update() {
		for (const system of this.#preUpdate) {
			system()
		}
		for (const system of this.#update) {
			system()
		}
		for (const system of this.#postUpdate) {
			system()
		}
	}

	exclusive(...states: State[]) {
		for (const state of states) {
			state.onExit(...states.filter(s => s !== state).map(s => () => this.disable(s)))
		}
	}
}
export class State {
	_enter = new Array<EnterSystem>()
	_exit = new Array<SystemFunction>()
	_preUpdate = new Array<System>()
	_postUpdate = new Array<System>()
	_update = new Array<System>()
	onEnter(...systems: EnterSystem[]) {
		this._enter.push(...systems)
		return this
	}

	onExit(...systems: SystemFunction[]) {
		this._exit.push(...systems)
		return this
	}

	onPreUpdate(...systems: System[]) {
		this._preUpdate.push(...systems)
		return this
	}

	onPostUpdate(...systems: System[]) {
		this._postUpdate.push(...systems)
		return this
	}

	onUpdate(...systems: System[]) {
		this._update.push(...systems)
		return this
	}

	addPlugins(...plugins: Array<(state: State) => void>) {
		for (const plugin of plugins) {
			plugin(this)
		}
		return this
	}
}
export const runIf = (condition: () => boolean, ...systems: System[]) => () => {
	if (condition()) {
		for (const system of systems) {
			system()
		}
	}
}

export const throttle = (delay: number, ...systems: System[]) => {
	let time = Date.now()
	return () => {
		if (Date.now() - time >= delay) {
			for (const system of systems) {
				system()
			}
			time = Date.now()
		}
	}
}
export const set = (...systems: System[]): System => () => {
	for (const system of systems) {
		system()
	}
}
export const before = (before: System, ...systems: System[]) => {
	const beforeSet = set(...systems)
	beforeSet.before = before
	return beforeSet
}
export const after = (after: System, ...systems: System[]) => {
	const afterSet = set(...systems)
	afterSet.after = after
	return afterSet
}