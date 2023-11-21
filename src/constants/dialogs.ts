export const dialogs: Partial<Record<characters, () => Generator<string | string[], void>>> = {
	*howard() {
		yield 'hello'
	},
}