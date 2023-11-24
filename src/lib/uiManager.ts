import { useSyncExternalStore } from 'preact/compat'

export class UiManager {
	listeners: (() => void)[] = []
	subscribe(fn: () => void) {
		this.listeners.push(fn)
		return () => this.listeners = this.listeners.filter(l => l !== fn)
	}

	rerender = () => {
		for (const listener of this.listeners) {
			listener()
		}
	}

	useProps(props: any) {
		return useSyncExternalStore(this.subscribe, () => props)
	}
}