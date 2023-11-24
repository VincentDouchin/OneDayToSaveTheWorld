import { Vector3 } from 'three'
import { DialogUi } from './dialogUi'
import { dialogs } from '@/constants/dialogs'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'
import { menuBundle } from '@/ui/menu'

export const dialogBundle = (name: keyof characters): Entity => {
	const dialog = dialogs?.[name]
	if (dialog) {
		return {
			dialog: dialog(),
			template: DialogUi,
			uiPosition: new Vector3(0, 8, 0),
			...menuBundle(),
		}
	}
	return {}
}

const dialogQuery = ecs.with('dialog', 'position')
const playerQuery = ecs.with('playerInputMap', 'position')
export const displayBubble = () => {
	for (const player of playerQuery) {
		for (const npc of dialogQuery) {
			if (npc.position.distanceTo(player.position) < 16) {
				addTag(npc, 'cameraTarget')
				if (player.playerInputMap.get('interact').justPressed) {
					addTag(npc, 'menu')
					if (!('currentDialog' in npc)) {
						ecs.addComponent(npc, 'currentDialog', npc.dialog.next().value ?? null)
					}
				}
			} else {
				ecs.removeComponent(npc, 'cameraTarget')
				ecs.removeComponent(npc, 'menu')
				ecs.removeComponent(npc, 'currentDialog')
			}
		}
	}
}