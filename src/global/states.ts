import type LDTKEnums from '@/constants/exports/LDTKEnums'
import type { NodeId } from '@/levels/LDTKEntities'
import type { direction } from '@/lib/direction'
import { StateMananger } from '@/lib/state'

export const app = new StateMananger()
// ! Core
export const core = app.create()
export interface overWorldRessources {
	battleNodeId?: NodeId
	direction?: direction
}
// ! Overworld
export const overWorldState = app.create<overWorldRessources>()
export interface battleRessources {
	battle: typeof LDTKEnums['battles'][number]
	battleNodeId: NodeId
	direction?: direction
}
// ! Battle
export const battleEnterState = app.create<battleRessources>()
export const battleState = app.create<battleRessources>()
export const battleExitState = app.create<battleRessources>()

// ! Dungeon
export interface dungeonRessources {
	dungeon: levels
	levelIndex: number
	direction: direction
}
export const dungeonState = app.create<dungeonRessources>()

// ! Setup
export const setupState = app.create()

app.exclusive(setupState, overWorldState, battleEnterState, battleState, battleExitState, dungeonState)