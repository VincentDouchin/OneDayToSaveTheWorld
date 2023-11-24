import { ecs } from './global/init'
import { BattlerType } from './states/battle/battlerBundle'

const enemiesQuery = ecs.with('battler').where(({ battler }) => battler === BattlerType.Enemy)
export const debug = () => {
	window.d = (key: string) => {
		switch (key) {
			case 'kill':{
				for (const enemy of enemiesQuery) {
					ecs.remove(enemy)
				}
			}
		}
	}
}