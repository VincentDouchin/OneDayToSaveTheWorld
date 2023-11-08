import type { Box2, Group, OrthographicCamera, Scene, Texture, Vector2, Vector3, WebGLRenderer } from 'three'
import type { Tween } from '@tweenjs/tween.js'
import type { VNode } from 'inferno'
import type { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { PlayerInputs } from './inputMaps'
import type { Sprite } from '@/lib/sprite'
import type { LDTKEntityInstance } from '@/levels/LDTKentityBundle'
import type { LDTKComponents } from '@/levels/LDTKEntities'
import type { Timer } from '@/lib/time'
import type { InputMap } from '@/lib/inputs'

export type directionX = 'left' | 'right'
export type directionY = 'up' | 'down'

export type direction = 'up' | 'down' | 'left' | 'right'
export type animationName<C extends characters> = `${characterAnimations[C]}-${directionX}-${directionY}`
interface animations<C extends characters> {
	animations?: Record<string, Texture[]>
	character?: C
	state?: characterAnimations[C]
}
export type Entity = {
	// ! Three
	scene?: Scene
	renderer?: WebGLRenderer
	cssRenderer?: CSS2DRenderer
	group?: Group
	sprite?: Sprite
	// ! Camera
	camera?: OrthographicCamera
	mainCamera?: true
	cameraBounds?: Box2
	cameraTarget?: true
	// ! Transforms
	position?: Vector3
	// ! Hierarchy
	parent?: Entity
	children?: Set<Entity>
	// ! LDTK
	ldtkEntityInstance?: LDTKEntityInstance
	// ! Overworld
	map?: true
	currentNode?: true
	// ! Animations
	directionX?: 'left' | 'right'
	directionY?: 'up' | 'down'
	currentState?: string
	animationIndex?: number
	animationTimer?: Timer
	// ! Navigation
	navigator?: true
	navigating?: direction
	navArrow?: true
	// ! Inputs
	playerInputMap?: InputMap<PlayerInputs>
	// ! Tween
	tween?: Tween<any>
	// ! UI
	template?: () => VNode
	el?: HTMLElement
	uiRoot?: true
	uiPosition?: Vector2
	cssObject?: CSS2DObject
	// ! Health
	currentHealth?: number
	maxHealth?: number
} & Partial<LDTKComponents>
& animations<characters>
type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T]
export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity