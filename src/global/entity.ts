import type { Collider, ColliderDesc, RigidBody, RigidBodyDesc } from '@dimforge/rapier2d-compat'
import type { Tween } from '@tweenjs/tween.js'
import type { Box2, Camera, Group, Light, OrthographicCamera, Scene, Texture, Vector3, WebGLRenderer } from 'three'
import type { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer'
import type { CSS2DObject, CSS2DRenderer } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { InstanceSetupCallback, InstancedParticles } from 'vfx-composer'
import type { Module } from 'material-composer'
import type { MenuInputs, PlayerInputs } from './inputMaps'
import type { LDTKComponents } from '@/levels/LDTKEntities'
import type { LDTKEntityInstance } from '@/levels/LDTKentityBundle'
import type { direction } from '@/lib/direction'
import type { InputMap } from '@/lib/inputs'
import type { Sprite } from '@/lib/sprite'
import type { Timer } from '@/lib/time'
import type { ActionSelector, BattleAction, BattlerType, TargetSelector } from '@/states/battle/battlerBundle'

export type Constructor<T> = new (...args: any[]) => T
export type directionX = 'left' | 'right'
export type directionY = 'up' | 'down'

interface animations<C extends keyof characters> {
	animations?: Record<string, Texture[]>
	character?: C
	state?: string
}
export type Dialog = Generator<string | string[] | void, void, number | void>

export type Entity = {
	// ! Three
	scene?: Scene
	renderer?: WebGLRenderer
	composer?: EffectComposer
	cssRenderer?: CSS2DRenderer
	group?: Group
	sprite?: Sprite
	forward?: true
	light?: Light
	shadow?: true
	shadowEntity?: Entity
	// ! Particles
	emitter?: InstancedParticles
	amount?: () => number
	emit?: InstanceSetupCallback
	modules?: Module[]
	shaderMeta?: {
		update: (dt: number, camera: Camera, scene: Scene, gl: WebGLRenderer) => void
		dispose: () => void
	}
	// ! Rapier
	bodyDesc?: RigidBodyDesc
	body?: RigidBody
	colliderDesc?: ColliderDesc
	collider?: Collider
	// ! Camera
	camera?: OrthographicCamera
	mainCamera?: true
	cameraBounds?: Box2
	cameraTarget?: true
	cameraTargetOffset?: direction
	targetPosition?: Vector3
	fitWidth?: true
	fitHeight?: true
	// ! Transforms
	position?: Vector3
	// worldPosition?: Vector3
	ySorted?: true
	// ! Hierarchy
	parent?: Entity
	children?: Set<Entity>
	deathTimer?: Timer
	// ! LDTK
	ldtkEntityInstance?: LDTKEntityInstance
	// ! Overworld
	map?: true
	currentNode?: true
	// ! Animations
	directionX?: 'left' | 'right'
	directionY?: 'up' | 'down'
	locked?: true
	currentState?: string
	animationIndex?: number
	animationTimer?: Timer
	atlas?: Texture[]
	onAnimationFinished?: () => void
	changeOnHover?: true
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
	onClick?: () => void
	// ! Battle
	battleBackground?: true
	battleActions?: readonly BattleAction[]
	currentAction?: BattleAction
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
	// ! Dungeon
	dungeonMap?: true
	justEntered?: true
	hasEntered?: true
	// ! Dialog
	dialog?: Dialog
	currentDialog?: string | string[] | null
} & Partial<LDTKComponents>
& animations<keyof characters>
type Prettify<T> = {
	[K in keyof T]: T[K];
} & unknown

type KeysOfType<T, U> = {
	[K in keyof T]: T[K] extends U ? K : never;
}[keyof T]
export type ComponentsOfType<T> = Prettify<KeysOfType<Required<Entity>, T>> & keyof Entity