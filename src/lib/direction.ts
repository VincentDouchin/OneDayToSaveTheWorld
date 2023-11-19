export type direction = 'up' | 'down' | 'left' | 'right'
export const directions = ['up', 'down', 'left', 'right'] as const

export const otherDirection = {
	up: 'down',
	down: 'up',
	left: 'right',
	right: 'left',
} as const