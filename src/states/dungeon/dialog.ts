import { Vector3 } from 'three'
import { dialogUi } from './dialogUi'
import { dialogs } from '@/constants/dialogs'
import type { Entity } from '@/global/entity'
import { ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'

export const dialogBundle = (name: characters): Entity => {
	const dialog = dialogs?.[name]
	if (dialog) {
		return {
			dialog: dialog(),
			template: dialogUi,
			uiPosition: new Vector3(0, 8, 0),
			currentDialog: null,
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
			} else {
				ecs.removeComponent(npc, 'cameraTarget')
			}
		}
	}
}