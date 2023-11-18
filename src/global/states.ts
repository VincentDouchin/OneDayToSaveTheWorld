import type { direction } from './entity'
import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { NodeId } from '@/levels/LDTKEntities'
import { StateMananger } from '@/lib/state'

export const app = new StateMananger()
export const core = app.create()
export interface overWorldRessources {
	battleNodeId?: NodeId
	direction?: direction
}
export const overWorldState = app.create<overWorldRessources>()
export interface battleRessources {
	battle: typeof LDTKEnums['battles'][number]
	battleNodeId: NodeId
	direction?: direction
}
export const battleEnterState = app.create<battleRessources>()
export const battleState = app.create<battleRessources>()
export const battleExitState = app.create<battleRessources>()
app.exclusive(overWorldState, battleEnterState, battleState, battleExitState)