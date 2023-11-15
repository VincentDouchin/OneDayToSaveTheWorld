import type { Tween } from '@tweenjs/tween.js'
import type { Box2, Camera, Color, Group, Light, Scene, Texture, Vec2, Vector3, WebGLRenderer } from 'three'
import type { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { MenuInputs, PlayerInputs } from './inputMaps'
import type { LDTKComponents } from '@/levels/LDTKEntities'
import type { LDTKEntityInstance } from '@/levels/LDTKentityBundle'
import type { InputMap } from '@/lib/inputs'
import type { Sprite } from '@/lib/sprite'
import type { Timer } from '@/lib/time'
import type { ActionSelector, BattleAction, BattlerType, TargetSelector } from '@/states/battle/battlerBundle'

export type Constructor<T> = new (...args: any[]) => T
export type directionX = 'left' | 'right'
export type directionY = 'up' | 'down'

export type direction = 'up' | 'down' | 'left' | 'right'
export type state<C extends characters> = characterAnimations[C] | `${characterAnimations[C]}-shadow`
export type animationName<C extends characters> = `${state<C>}-${directionX}-${directionY}`
interface animations<C extends characters> {
	animations?: Record<string, Texture[]>
	character?: C
	state?: state<C>
}

export type Entity = {
	// ! Three
	scene?: Scene
	renderer?: WebGLRenderer
	cssRenderer?: CSS2DRenderer
	group?: Group
	sprite?: Sprite
	forward?: true
	size?: Vec2
	light?: Light
	shadow?: true
	shadowEntity?: Entity
	// ! Emissive
	emissiveMap?: Texture
	emissiveColor?: Color
	emissiveIntensity?: number
	// ! Camera
	camera?: Camera
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
	onAnimationFinished?: () => void
	// ! Navigation
	navigator?: true
	navigating?: direction
	navArrow?: true
	// ! Inputs
	playerInputMap?: InputMap<PlayerInputs>
	// ! Tween
	tween?: Tween<any>
	// ! UI
	template?: (entity: any) => any
	el?: HTMLElement
	uiRoot?: true
	uiPosition?: Vector3
	cssObject?: CSS2DObject
	// ! Health
	currentHealth?: number
	maxHealth?: number
	// ! Menu
	menu?: true
	menuId?: string
	elementId?: string
	selectedElement?: string | null
	menuInputMap?: InputMap<MenuInputs>
	// ! Battle
	battleActions?: BattleAction<any>[]
	currentAction?: BattleAction<any>
	finishedTurn?: true
	currentTurn?: true
	battler?: BattlerType
	actionSelector?: ActionSelector
	targetSelector?: TargetSelector
	target?: true
	takingAction?: true
	battlerMenu?: true
	targetSelectorMenu?: true
	name?: string
	// ! Sound effects
	sounds?: Record<string, Howl[]>
	currentSoundEffect?: Howl
} & Partial<LDTKComponents>
& animations<characters>
type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T]
export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity