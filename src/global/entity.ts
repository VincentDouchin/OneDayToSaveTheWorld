import type { Tween } from '@tweenjs/tween.js'
import type { With } from 'miniplex'
import type { Box2, Camera, Group, Scene, Texture, Vector3, WebGLRenderer } from 'three'
import type { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { MenuInputs, PlayerInputs } from './inputMaps'
import type { LDTKComponents } from '@/levels/LDTKEntities'
import type { LDTKEntityInstance } from '@/levels/LDTKentityBundle'
import type { InputMap } from '@/lib/inputs'
import type { Sprite } from '@/lib/sprite'
import type { Timer } from '@/lib/time'
import { OutlineShader } from '@/shaders/OutlineShader'
import type { ActionSelector, BattleAction, BattlerType, TargetSelector } from '@/states/battle/battlerBundle'

export type Constructor<T> = new (...args: any[]) => T
export type directionX = 'left' | 'right'
export type directionY = 'up' | 'down'

export type direction = 'up' | 'down' | 'left' | 'right'
export type animationName<C extends characters> = `${characterAnimations[C]}-${directionX}-${directionY}`
interface animations<C extends characters> {
	animations?: Record<string, Texture[]>
	character?: C
	state?: characterAnimations[C]
}
export const shaders = {
	outlineShader: OutlineShader,
}
type shaderComponents = { [S in keyof typeof shaders]: InstanceType<typeof shaders[S]> }
export type Entity = {
	// ! Three
	scene?: Scene
	renderer?: WebGLRenderer
	cssRenderer?: CSS2DRenderer
	group?: Group
	sprite?: Sprite
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
	selected?: true
	entityMenu?: Entity[]
	onSelected?: <C extends keyof Entity>(entity: With<Entity, C>) => void
	onUnSelected?: (entity: With<Entity, any>) => void
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
} & Partial<LDTKComponents>
& animations<characters>
& Partial<shaderComponents>
type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T]
export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity