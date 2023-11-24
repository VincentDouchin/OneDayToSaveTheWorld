export type playerNames = 'paladin'
export interface PlayerData {
	character: playerNames
	maxHealth: number
	currentHealth: number
}

export const players = (): Record<playerNames, PlayerData> => ({
	paladin: {
		character: 'paladin',
		maxHealth: 20,
		currentHealth: 20,
	},
})