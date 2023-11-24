import { createElement, render } from 'preact'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { State } from './state'
import { ecs } from '@/global/init'

const addUiRoot = () => {
	const el = document.createElement('div')
	el.style.position = 'fixed'
	el.style.inset = '0'
	el.style.display = 'grid'
	el.style.pointerEvents = 'none'
	el.style.zIndex = '1'
	document.body.appendChild(el)
	ecs.add({ el, uiRoot: true })
}

export const textStroke = (color = 'white', size = 1) => ({ textShadow: `${size}px ${size}px ${color}, -${size}px ${size}px ${color}, ${size}px -${size}px ${color}, -${size}px -${size}px ${color}` })

export const removeUi = () => ecs.with('el').onEntityRemoved.subscribe(({ el }) => el.remove())
const cssObjectsQuery = ecs.with('uiPosition', 'cssObject')
export const uiRootQuery = ecs.with('uiRoot', 'el')
const addUIElement = () => ecs.with('template').without('el').onEntityAdded.subscribe((entity) => {
	const el = document.createElement('div')
	if (entity.uiPosition) {
		const cssObject = new CSS2DObject(el)
		cssObject.renderOrder = 10
		cssObject.position.x = entity.uiPosition.x
		cssObject.position.y = entity.uiPosition.y
		ecs.addComponent(entity, 'cssObject', cssObject)
	} else if (entity.parent?.el) {
		entity.parent.el.appendChild(el)
	} else {
		const root = uiRootQuery.first
		if (root) {
			root.el.appendChild(el)
		}
	}

	render(createElement(entity.template, {}), el)
	ecs.addComponent(entity, 'el', el)
})
const renderUi = () => {
	for (const { uiPosition, cssObject } of cssObjectsQuery) {
		cssObject.position.x = uiPosition.x
		cssObject.position.y = uiPosition.y
	}
}
export const uiPlugin = (state: State) => {
	state.onEnter(addUiRoot, addUIElement).onUpdate(renderUi)
}
