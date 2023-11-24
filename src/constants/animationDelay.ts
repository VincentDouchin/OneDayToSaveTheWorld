export const animationDelay: { [C in keyof characters | 'default']?: Partial<Record<C extends keyof characters ? characters[C] : string, number>> } = {
	default: { idle: 200 },
}