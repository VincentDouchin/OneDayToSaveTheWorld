import { World as RapierWorld, init } from '@dimforge/rapier2d-compat'
import { World as MiniplexWorld } from 'miniplex'
import { loadAssets } from './assets'
import type { Entity } from './entity'
import { PointersManager } from '@/lib/pointers'
import { Time } from '@/lib/time'

await init()
export const assets = await loadAssets()
export const world = new RapierWorld({ x: 0, y: 0 })
export const ecs = new MiniplexWorld<Entity>()
export const pointers = new PointersManager()
export const time = new Time()