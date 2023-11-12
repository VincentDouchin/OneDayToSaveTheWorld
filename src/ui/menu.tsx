import type { VNode } from 'inferno'
import type { With } from 'miniplex'
import { Color } from 'three'
import { generateUUID } from 'three/src/math/MathUtils'
import type { Entity, direction } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { hasComponents } from '@/lib/hierarchy'
import { styles } from '@/lib/ui'
import { OutlineShader } from '@/shaders/OutlineShader'
import { menuInputMap } from '@/global/inputMaps'

const menuQuery = ecs.with('menu', 'menuId')
const activateMenu = () => menuQuery.onEntityAdded.subscribe((entity) => {
	const element = document.querySelector(`[data-selectable][data-id="${entity.menuId}"]`) as HTMLElement
	if (element) {
		ecs.addComponent(entity, 'selectedElement', element.dataset.selectable)
	}
})
const deactivateMenu = () => menuQuery.onEntityRemoved.subscribe((entity) => {
	ecs.removeComponent(entity, 'selectedElement')
})
export const menuActivation = [activateMenu, deactivateMenu]

const findSelected = (menu: With<Entity, 'menuId' | 'selectedElement'>) => {
	return document.querySelector(`[data-selectable="${menu.selectedElement}"][data-id="${menu.menuId}"]`) as HTMLElement
}
const findElements = (menu: With<Entity, 'menuId'>) => {
	return document.querySelectorAll(`[data-selectable][data-id="${menu.menuId}"]`) as NodeListOf<HTMLElement>
}
const findClosest = (menu: With<Entity, 'menuId'>) => (direction: direction) => {
	let distance = Number.POSITIVE_INFINITY
	let closest: string | null = null
	const neighbors = findElements(menu)
	if (!menu.selectedElement) {
		ecs.addComponent(menu, 'selectedElement', neighbors[0].dataset.selectable)
	}
	if (menu.selectedElement) {
		const menuWithSelected = hasComponents(menu, 'selectedElement')
		if (menuWithSelected) {
			const selected = findSelected(menuWithSelected)
			if (selected) {
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
							distance = distanceToNeighbor
							const key = neighbor.dataset.selectable
							if (key) {
								closest = key
							}
						}
					}
				}
			}
		}
	}
	if (closest) {
		menu.selectedElement = closest
	}
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
			if (menu.menuInputMap.get('validate').justPressed) {
				const menuWithSelected = hasComponents(menu, 'selectedElement')
				if (menuWithSelected) {
					findSelected(menuWithSelected).click()
				}
			}
		}
	}
}
export const SelectedArrow = (props: { entity: Entity }) => {
	const menu = hasComponents(props.entity, 'selectedElement', 'menu', 'menuId')
	if (menu?.menu && menu.selectedElement) {
		const selected = findSelected(menu)
		const rect = selected.getBoundingClientRect()
		return (
			<img
				class="menu-arrow"
				style={styles({ position: 'fixed', top: `${rect.top + rect.height / 2}px`, left: `${rect.left}px`, width: `${assets.ui.selectorleft.width * 4}px`, translate: '-10% -50%', pointerEvents: 'none' })}
				src={assets.ui.selectorleft.src}
			>
			</img>
		)
	}
}

export const Selectable = (props: { tag: string; menu: With<Entity, 'menuId' >; onClick: () => void; children: VNode | VNode[] }) => (
	<div
		data-selectable={props.tag}
		data-id={props.menu.menuId}
		onPointerEnter={() => {
			'selectedElement' in props.menu && (props.menu.selectedElement = props.tag)
		}}
		onClick={() => props.menu.menu && props.onClick()}
	>
		{props.children}
	</div>
)

export const outlineOnSelectBundle = (): Entity => ({
	onSelected: (entity: Entity) => entity.sprite?.composer.addPass(new OutlineShader(new Color(0xFFFFFF))),
	onUnSelected: (entity: Entity) => entity.sprite?.composer.removePass(OutlineShader),
})
export const menuBundle = () => ({ ...menuInputMap(), menuId: generateUUID() } as const)