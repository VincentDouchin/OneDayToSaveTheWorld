import { World as MiniplexWorld } from 'miniplex'
import { World as RapierWorld, init } from '@dimforge/rapier2d-compat'
import type { Entity } from './entity'

await init()
export const world = new RapierWorld({ x: 0, y: 0 })
export const ecs = new MiniplexWorld<Entity>()
