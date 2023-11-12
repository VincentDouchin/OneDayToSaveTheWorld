import { render } from 'inferno'
import type { StandardProperties } from 'csstype'
import { CSS2DObject } from 'three/examples/jsm/renderers/CSS2DRenderer'
import type { State } from './state'
import { ecs } from '@/global/init'

const addUiRoot = () => {
	const el = document.createElement('div')
	el.style.position = 'fixed'
	el.style.inset = '0'
	el.style.display = 'grid'
	document.body.appendChild(el)
	ecs.add({ el, uiRoot: true })
}
export const uiRootQuery = ecs.with('uiRoot', 'el')
const addUIElement = () => ecs.with('template').without('el').onEntityAdded.subscribe((entity) => {
	const el = document.createElement('div')
	if (entity.uiPosition) {
		const cssObject = new CSS2DObject(el)
		cssObject.renderOrder = 10
		cssObject.position.x = entity.uiPosition.x
		cssObject.position.y = entity.uiPosition.y
		cssObject.position.y = entity.uiPosition.z
		ecs.addComponent(entity, 'cssObject', cssObject)
	} else	if (entity.parent?.el) {
		entity.parent.el.appendChild(el)
	} else {
		const root = uiRootQuery.first
		if (root) {
			root.el.appendChild(el)
		}
	}

	render(entity.template(entity), el)
	ecs.addComponent(entity, 'el', el)
})
const uiQuery = ecs.with('template', 'el')
const renderUi = () => {
	for (const entity of uiQuery) {
		render(entity.template(entity), entity.el)
	}
}
export const uiPlugin = (state: State) => {
	state.onEnter(addUiRoot, addUIElement).onUpdate(renderUi)
}
export const styles = (styles: Partial<StandardProperties>) => {
	return Object.entries(styles).map(([key, val]) => `${key.replace(/[A-Z]+(?![a-z])|[A-Z]/g, ($, ofs) => (ofs ? '-' : '') + $.toLowerCase())}: ${val}`).join(';')
}
