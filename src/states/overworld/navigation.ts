import { Easing, Tween } from '@tweenjs/tween.js'
import type { Texture } from 'three'
import { Vector3 } from 'three'

import { assets, ecs } from '@/global/init'
import { battleEnterState, dungeonState } from '@/global/states'
import { addTag } from '@/lib/hierarchy'
import { changeOnHoverBundle } from '@/lib/interactions'
import { updateSave } from '@/global/save'
import type { direction } from '@/lib/direction'

const currentNodeQuery = ecs.with('currentNode', 'node', 'position', 'ldtkEntityInstance')
const otherNodesQuery = ecs.with('node', 'position', 'ldtkEntityInstance').without('currentNode')
const findNextNode = (direction: direction) => {
	const [{ position, node }] = currentNodeQuery
	return Array.from(otherNodesQuery).find((otherNode) => {
		if (!node.directions.includes(otherNode.ldtkEntityInstance.id)) return false
		switch (direction) {
			case 'up' : return otherNode.position.x === position.x && otherNode.position.y > position.y
			case 'down' :return otherNode.position.x === position.x && otherNode.position.y < position.y
			case 'left' :return otherNode.position.x < position.x && otherNode.position.y === position.y
			case 'right' :return otherNode.position.x > position.x && otherNode.position.y === position.y
			default:return false
		}
	})
}

const navigatorQuery = ecs.with('navigator', 'menuInputMap', 'position', 'state').without('navigating').where(({ character }) => character === 'paladin')

export const navigate = () => {
	for (const player of navigatorQuery) {
		for (const direction of ['up', 'down', 'left', 'right'] as const) {
			if (player.menuInputMap.get(direction).justPressed) {
				if (findNextNode(direction)) {
					ecs.addComponent(player, 'navigating', direction)
				}
			}
		}
	}
}
const arrowAtlases: Record<direction, [Texture, Texture]> = {
	right: [assets.mapIcons.arrowRight, assets.mapIcons.arrowRightSelected],
	left: [assets.mapIcons.arrowLeft, assets.mapIcons.arrowLeftSelected],
	down: [assets.mapIcons.arrowDown, assets.mapIcons.arrowDownSelected],
	up: [assets.mapIcons.arrowUp, assets.mapIcons.arrowUpSelected],
}

const getArrowDirection = (pos: Vector3): direction => {
	if (pos.x > 0) {
		return 'right'
	}
	if (pos.x < 0) {
		return 'left'
	}
	if (pos.y < 0) {
		return 'down'
	}
	return 'up'
}

const createNavigationArrows = () => navigatorQuery.onEntityAdded.subscribe(() => {
	const [currentNode] = currentNodeQuery
	const { node, position } = currentNode
	if (node) {
		for (const otherNode of otherNodesQuery) {
			if (node.directions.includes(otherNode.ldtkEntityInstance.id)) {
				const arrowPosition = otherNode.position.clone().sub(position).normalize().multiplyScalar(16)
				const tween = new Tween(arrowPosition)
					.to(arrowPosition.clone().add(new Vector3(0, 1, 0)), 1000)
					.easing(Easing.Quadratic.InOut)
					.repeat(Number.POSITIVE_INFINITY)
					.yoyo(true)
				const direction = getArrowDirection(arrowPosition)
				ecs.add({
					tween,
					parent: currentNode,
					position: arrowPosition,
					navArrow: true,

					...changeOnHoverBundle(...arrowAtlases[direction]),
					onClick: () => {
						for (const player of navigatorQuery) {
							ecs.addComponent(player, 'navigating', direction)
							assets.uiSounds.Hover_01.play()
						}
					},
				})
			}
		}
	}
})

const navArrowQuery = ecs.with('navArrow')
const removeNavigationArrows = () => ecs.with('navigating', 'position').onEntityAdded.subscribe((player) => {
	for (const entity of navArrowQuery) {
		ecs.remove(entity)
	}
	const direction = player.navigating
	const target = findNextNode(direction)
	const current = currentNodeQuery.first
	if (target && current) {
		updateSave(s => s.lastNodeUUID = current.ldtkEntityInstance.id)
		updateSave(s => s.nodesVisited = [...new Set([...s.nodesVisited, current.ldtkEntityInstance.id])])
		switch (direction) {
			case 'left':
			case 'right': player.directionX = direction; break
			case 'up':
			case 'down': player.directionY = direction
		}
		ecs.removeComponent(current, 'currentNode')
		const distance = target.position.clone().sub(player.position).length()
		player.state = 'walk'
		const tween = new Tween(player.position).to(target.position, distance * 20).onComplete(() => {
			addTag(target, 'currentNode')
			ecs.removeComponent(player, 'tween')
			ecs.removeComponent(player, 'navigating')
			player.state = 'idle'
			const battle = target.node.battle
			if (battle) {
				battleEnterState.enable({ battle, battleNodeId: target.ldtkEntityInstance.id, direction })
				updateSave(s => s.lastBattle = battle)
			}
			const dungeon = target.node.dungeon
			const levelIndex = target.node.level
			if (dungeon && typeof levelIndex === 'number') {
				updateSave(s => s.lastNodeUUID = target.ldtkEntityInstance.id)
				dungeonState.enable({ dungeon, levelIndex, direction })
			}
		})
		ecs.addComponent(player, 'tween', tween)
	}
})

export const nativationArrows = [createNavigationArrows, removeNavigationArrows]
