import type { Dialog } from '@/global/entity'
import { beer } from '@/global/items'
import { updateSave } from '@/global/save'
import { lockPlayer, pay, unlockPlayer } from '@/utils/dialogUtils'

export const dialogs: Partial<Record<keyof characters, () => Dialog>> = {
	*howard() {
		yield 'Hello adventurer!'
		yield 'My name is Howard'
		yield 'I am the innkeeper'
		while (true) {
			lockPlayer()
			yield 'Do you want a drink?'
			const answer = yield ['yes', 'no']
			if (answer === 0) {
				yield 'It will be 10 gils please'
				const answer = yield ['Pay', 'Leave']
				if (answer === 0) {
					if (pay(10)) {
						updateSave(s => s.teams[s.currentTeam].inventory.push(beer()))
						yield 'Here you go!'
						yield '...'
						yield 'Did you just put a full pint of beer in your backpack?'
					} else {
						yield 'It seems like you don\'t have enough money, sorry!'
					}
				} else {
					yield 'Goodbye!'
				}
			}
			unlockPlayer()
			yield
		}
	},
	*banditoldman() {
		yield 'Hello stranger'
		yield 'Won\'t you buy an old man a beer?'
	},
}