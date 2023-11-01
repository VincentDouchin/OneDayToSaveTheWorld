import type { Group, OrthographicCamera, Scene, Vector3, WebGLRenderer } from 'three'
import type { Sprite } from '@/lib/sprite'
export interface Entity {
	// ! Three
	scene?: Scene
	renderer?: WebGLRenderer
	group?: Group
	camera?: OrthographicCamera
	mainCamera?: true
	sprite?: Sprite
	// ! Transforms
	position?: Vector3
	// ! Hierarchy
	parent?: Entity
	children?: Set<Entity>
}
type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T]
export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity
