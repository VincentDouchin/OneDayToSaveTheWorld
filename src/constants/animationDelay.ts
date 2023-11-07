export const animationDelay: { [C in characters | 'default']?: Partial<Record<C extends characters ? characterAnimations[C] : string, number>> } = {
	default: { idle: 200 },
}