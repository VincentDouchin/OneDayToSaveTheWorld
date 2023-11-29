export type System<R> = (ressources: R) => void
export type Subscriber<R> = (ressources: R) => (ressources: R) => void

export class StateMananger {
	states = new Map<State<any>, any>()
	callbacks = new Map<State<any>, System<any>[]>()
	create<R = void>() {
		return new State<R>(this)
	}

	enable<S extends State<R>, R>(state: S, ressources: R) {
		this.states.set(state, ressources)
		if (state._subscribers.length) {
			this.callbacks.set(state, state._subscribers.map(s => s(ressources)))
		}
		for (const system of state._enter) {
			system(ressources)
		}
	}

	disable(state: State<any>) {
		const ressources = this.states.get(state)
		for (const system of state._exit) {
			system(ressources)
		}
		const callbacks = this.callbacks.get(state)
		if (callbacks) {
			for (const callback of callbacks) {
				callback(ressources)
			}
		}
		this.states.delete(state)
	}

	update() {
		for (const [state, ressources] of this.states.entries()) {
			for (const system of state._preUpdate) {
				system(ressources)
			}
		}
		for (const [state, ressources] of this.states.entries()) {
			for (const system of state._update) {
				system(ressources)
			}
		}
		for (const [state, ressources] of this.states.entries()) {
			for (const system of state._postUpdate) {
				system(ressources)
			}
		}
	}

	exclusive(...states: State<any>[]) {
		for (const state of states) {
			state.onEnter(...states.filter(s => s !== state).map(s => () => this.states.has(s) && s.disable()))
		}
	}
}
export class State<R = void> {
	_enter = new Array<System<R>>()
	_exit = new Array<System<R>>()
	_preUpdate = new Array<System<R>>()
	_postUpdate = new Array<System<R>>()
	_update = new Array<System<R>>()
	_subscribers = new Array<Subscriber<R>>()
	_callBacks = new Array<System<R>>()
	#app: StateMananger
	constructor(app: StateMananger) {
		this.#app = app
	}

	get enabled() {
		return this.#app.states.has(this)
	}

	addSubscriber(...subscribers: Subscriber<R>[]) {
		this._subscribers.push(...subscribers)
		return this
	}

	onEnter(...systems: System<R>[]) {
		this._enter.push(...systems)
		return this
	}

	onExit(...systems: System<R>[]) {
		this._exit.push(...systems)
		return this
	}

	onPreUpdate(...systems: System<R>[]) {
		this._preUpdate.push(...systems)
		return this
	}

	onPostUpdate(...systems: System<R>[]) {
		this._postUpdate.push(...systems)
		return this
	}

	onUpdate(...systems: System<R>[]) {
		this._update.push(...systems)
		return this
	}

	addPlugins(...plugins: Array<(state: State<R>) => void>) {
		for (const plugin of plugins) {
			plugin(this)
		}
		return this
	}

	enable(ressources: R) {
		this.#app.enable(this, ressources)
	}

	disable() {
		this.#app.disable(this)
	}
}
export const runIf = <R>(condition: () => boolean, ...systems: System<R>[]) => (ressources: R) => {
	if (condition()) {
		for (const system of systems) {
			system(ressources)
		}
	}
}

export const throttle = <R>(delay: number, ...systems: System<R>[]) => {
	let time = Date.now()
	return (ressources: R) => {
		if (Date.now() - time >= delay) {
			for (const system of systems) {
				system(ressources)
			}
			time = Date.now()
		}
	}
}
export const set = <R>(systems: System<R>[]): System<R> => (ressources: R) => {
	for (const system of systems) {
		system(ressources)
	}
}
