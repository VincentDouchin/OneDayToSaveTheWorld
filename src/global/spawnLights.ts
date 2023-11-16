import { AmbientLight } from 'three'
import { ecs } from './init'

export const spawnLight = () => ecs.add({ light: new AmbientLight(0xFFFFFF, 3) })