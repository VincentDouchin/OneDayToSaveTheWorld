import type { StandardProperties } from 'csstype'
import type { With } from 'miniplex'
import type { Accessor, Component } from 'solid-js'
import { For, createEffect, createMemo, createSignal } from 'solid-js'
import type { JSX } from 'solid-js/jsx-runtime'
import { generateUUID } from 'three/src/math/MathUtils'
import type { Entity } from '@/global/entity'
import { assets, ecs, ui } from '@/global/init'
import type { MenuInputs } from '@/global/inputMaps'
import { menuInputMap } from '@/global/inputMaps'
import { type direction, directions } from '@/lib/direction'
import { hasComponents } from '@/lib/hierarchy'
import { sleep } from '@/utils/sleep'
import type { InputMap } from '@/lib/inputs'

const menuQuery = ecs.with('menu', 'menuId')
const selectFirstElement = (entity: With<Entity, 'menuId'>) => {
	const element = document.querySelector(`[data-selectable][data-id="${entity.menuId}"]`) as HTMLElement
	if (element) {
		assets.uiSounds.Hover_06.play()
		if (entity.selectedElement) {
			entity.selectedElement = element.dataset.selectable
		} else {
			ecs.addComponent(entity, 'selectedElement', element.dataset.selectable)
		}
	}
}
const activateMenu = () => menuQuery.onEntityAdded.subscribe((entity) => {
	sleep(100).then(() => selectFirstElement(entity))
})
const deactivateMenu = () => menuQuery.onEntityRemoved.subscribe((entity) => {
	ecs.removeComponent(entity, 'selectedElement')
})
export const menuActivation = [activateMenu, deactivateMenu]

const findSelected = (menu: With<Entity, 'menuId' | 'selectedElement'>) => {
	return document.querySelector<HTMLElement>(`[data-selectable="${menu.selectedElement}"][data-id="${menu.menuId}"]`)
}
const findElements = (menu: With<Entity, 'menuId'>) => {
	return document.querySelectorAll<HTMLElement>(`[data-selectable][data-id="${menu.menuId}"]`)
}
const findClosest = (selected: HTMLElement, neighbors: IterableIterator<HTMLElement>) => (direction: direction) => {
	let distance = Number.POSITIVE_INFINITY
	let closest: HTMLElement | null = null
	const selectedRect = selected.getBoundingClientRect()
	let elementX = selectedRect.x + selectedRect.width / 2
	let elementY = selectedRect.y + selectedRect.height / 2
	if (direction === 'left') {
		elementX -= selectedRect.width / 2
	} else if (direction === 'right') {
		elementX += selectedRect.width / 2
	} else if (direction === 'up') {
		elementY -= selectedRect.height / 2
	} else if (direction === 'down') {
		elementY += selectedRect.height / 2
	}
	for (const neighbor of neighbors) {
		if (neighbor !== selected) {
			const dim = neighbor.getBoundingClientRect()
			const neighborX = dim.x + dim.width / 2
			const neighborY = dim.y + dim.height / 2
			const distanceToNeighbor = (elementX - neighborX) ** 2 + (elementY - neighborY) ** 2
			if (distance > distanceToNeighbor) {
				let isInDirection = false
				if (direction === 'down') {
					isInDirection = elementY < neighborY
				}
				if (direction === 'up') {
					isInDirection = elementY > neighborY
				}
				if (direction === 'right') {
					isInDirection = elementX < neighborX
				}
				if (direction === 'left') {
					isInDirection = elementX > neighborX
				}
				if (isInDirection) {
					distance = distanceToNeighbor
					closest = neighbor
				}
			}
		}
	}
	return closest
}
const menuInitializedQuery = menuQuery.with('menuInputMap')

export const updateMenus = () => {
	for (const menu of menuInitializedQuery) {
		if (menu.menu) {
			const findNewSelected = findClosest(menu)
			for (const direction of ['up', 'down', 'left', 'right'] as const) {
				if (menu.menuInputMap.get(direction).justPressed) {
					findNewSelected(direction)
				}
			}
			const menuWithSelected = hasComponents(menu, 'selectedElement')
			if (menuWithSelected) {
				if (!findSelected(menuWithSelected)) {
					selectFirstElement(menu)
				}
				if (menu.menuInputMap.get('validate').justPressed) {
					findSelected(menuWithSelected)?.click()
				}
			}
		}
	}
}
export const SelectedArrow = (entity: With<Entity, 'selectedElement' | 'menu' | 'menuId'>) => {
	const menu = hasComponents(entity, 'selectedElement', 'menu', 'menuId')
	if (menu?.menu && menu.selectedElement) {
		const selected = findSelected(menu)
		if (selected) {
			const rect = selected.getBoundingClientRect()
			return (
				<img
					class="menu-arrow"
					style={{ 'position': 'fixed', 'top': `${rect.top + rect.height / 2}px`, 'left': `${rect.left}px`, 'width': `${assets.ui.selectorleft.width * 4}px`, 'transform': 'translate(-10%,-50%)', 'pointer-events': 'none', 'z-index': 1 }}
					src={assets.ui.selectorleft.src}
				>
				</img>
			)
		}
	}
	return <></>
}

// export const Selectable = (props: { tag: string; menu: With<Entity, 'menuId'>; onClick: () => void; children: JSX.Element; style?: Partial<StandardProperties>; selectable?: boolean; input?: MenuInputs; button?: boolean }) => {
// 	const style = {
// 		pointerEvents: 'all',
// 		...props.style,
// 	}
// 	if (props.input && props.menu.menuInputMap?.get(props.input).justPressed) {
// 		props.onClick()
// 	}
// 	return (
// 		<div
// 			data-selectable={props.tag}
// 			data-id={(props.selectable ?? true) && props.menu.menuId}
// 			onPointerEnter={() => 'selectedElement' in props.menu && (props.menu.selectedElement = props.tag)}
// 			onPointerLeave={() => 'selectedElement' in props.menu && props.button && (props.menu.selectedElement = null)}
// 			onClick={() => (props.menu.menu || props.button) && props.onClick()}
// 			style={style}
// 		>
// 			{props.children}
// 		</div>
// 	)
// }

export const menuBundle = (name?: string) => ({ ...menuInputMap(), menuId: name ?? generateUUID() } as const)

interface MenuProps<T> {
	items: T[]
	children: Component<MenuItemProps<T>>
	inputs?: InputMap<MenuInputs>
	onValidate: (item: T) => void
}
export interface MenuItemProps<T> {
	data: T
	selected: Accessor<boolean>
}
export function Menu<T>(props: MenuProps<T>) {
	const [selected, setSelected] = createSignal<T>(props.items[0])
	const refs = new Map<T, HTMLElement>()
	const inverseRefs = new Map<HTMLElement, T>()

	const inputs = ui.syncStore(props.inputs)
	createEffect(() => {
		for (const direction of directions) {
			if (inputs()?.get(direction).justPressed) {
				const selectedElement = refs.get(selected())
				if (selectedElement) {
					const finder = findClosest(selectedElement, refs.values())
					const newSelectedElement = finder(direction)
					if (newSelectedElement) {
						const newSelected = inverseRefs.get(newSelectedElement)
						if (newSelected) {
							setSelected(() => newSelected)
						}
					}
				}
			}
		}
	})
	return (
		<For each={props.items}>
			{(children) => {
				const isSelected = createMemo(() => selected() === children)
				return (
					<div
						ref={(el) => { refs.set(children, el); inverseRefs.set(el, children) }}
						style={{ 'pointer-events': 'all' }}
						onMouseEnter={() => setSelected(() => children)}
						onClick={() => props.onValidate(children)}
					>
						<props.children selected={isSelected} data={children}></props.children>
					</div>
				)
			}}

		</For>
	)
}