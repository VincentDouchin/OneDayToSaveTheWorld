import { State, StateMananger } from '@/lib/state'

export const app = new StateMananger()
export const core = new State()
export const overWorldState = new State()
export const battleState = new State()
// app.exclusive(overWorldState, battleState)