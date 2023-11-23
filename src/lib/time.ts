export class Time {
	current = Date.now()
	delta = 0
	elapsed = 0
	get deltaSeconds() {
		return this.delta / 1000
	}

	tick(newTime: number) {
		this.delta = newTime - this.current
		this.current = newTime
		this.elapsed += this.delta
	}
}

export class Timer {
	elapsed = 0
	#lastTick = 0
	ticks = 0

	constructor(public delay: number) {}

	get percentFinished() {
		return this.elapsed / this.delay
	}

	tick(delta: number) {
		this.elapsed += delta
		this.#lastTick = this.ticks
		this.ticks = Math.floor(this.elapsed / this.delay)
	}

	get justFinished() {
		return this.ticks !== this.#lastTick
	}

	get finished() {
		return this.ticks > 0
	}
}