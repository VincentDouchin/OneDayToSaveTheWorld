export const time = new class Time {
	current = Date.now()
	delta = 0
	elapsed = 0
	tick(newTime: number) {
		this.delta = newTime - this.current
		this.current = newTime
		this.elapsed += this.delta
	}
}()
