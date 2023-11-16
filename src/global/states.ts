import type LDTKEnums from '@/constants/exports/LDTKEnums'
import { StateMananger } from '@/lib/state'

export const app = new StateMananger()
export const core = app.create()
export const overWorldState = app.create()
export interface battleRessources {
	battle: typeof LDTKEnums['battles'][number]
}
export const battleEnterState = app.create<battleRessources>()
export const battleState = app.create<battleRessources>()
export const battleExitState = app.create<battleRessources>()
app.exclusive(overWorldState, battleEnterState)
app.exclusive(battleEnterState, battleState, battleExitState)