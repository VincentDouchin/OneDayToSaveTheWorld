import { Easing, Tween } from '@tweenjs/tween.js'
import { Vector3 } from 'three'

import type { direction } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'
import { Sprite } from '@/lib/sprite'
import { app, battleState } from '@/global/states'

const currentNodeQuery = ecs.with('currentNode', 'Node', 'position')
const otherNodesQuery = ecs.with('Node', 'position', 'ldtkEntityInstance').without('currentNode')
const findNextNode = (direction: direction) => {
	const [{ position, Node }] = currentNodeQuery
	return Array.from(otherNodesQuery).find((otherNode) => {
		if (!Node.directions.includes(otherNode.ldtkEntityInstance.id)) return false
		switch (direction) {
			case 'up' : return otherNode.position.x === position.x && otherNode.position.y > position.y
			case 'down' :return otherNode.position.x === position.x && otherNode.position.y < position.y
			case 'left' :return otherNode.position.x < position.x && otherNode.position.y === position.y
			case 'right' :return otherNode.position.x > position.x && otherNode.position.y === position.y
			default:return false
		}
	})
}

const navigatorQuery = ecs.with('navigator', 'playerInputMap', 'position', 'state').without('navigating').where(({ character }) => character === 'paladin')
export const navigate = () => {
	for (const player of navigatorQuery) {
		for (const direction of ['up', 'down', 'left', 'right'] as const) {
			if (player.playerInputMap.get(direction).justPressed) {
				const target = findNextNode(direction)
				const [current] = currentNodeQuery
				switch (direction) {
					case 'left':
					case 'right': player.directionX = direction; break
					case 'up':
					case 'down': player.directionY = direction
				}
				if (target) {
					ecs.removeComponent(current, 'currentNode')
					ecs.addComponent(player, 'navigating', direction)
					const distance = target.position.clone().sub(player.position).length()
					player.state = 'walk'
					const tween = new Tween(player.position).to(target.position, distance * 20).onComplete(() => {
						addTag(target, 'currentNode')
						ecs.removeComponent(player, 'tween')
						ecs.removeComponent(player, 'navigating')
						player.state = 'idle'
						if (target.Node.battle) {
							app.enable(battleState)
						}
					})
					ecs.addComponent(player, 'tween', tween)
				}
			}
		}
	}
}
const getArrowSprite = (pos: Vector3) => {
	if (pos.x > 0) {
		return assets.mapIcons.arrowRight
	}
	if (pos.x < 0) {
		return assets.mapIcons.arrowLeft
	}
	if (pos.y < 0) {
		return assets.mapIcons.arrowDown
	}
	return assets.mapIcons.arrowUp
}

export const createNavigationArrows = () => navigatorQuery.onEntityAdded.subscribe(() => {
	const [currentNode] = currentNodeQuery
	const { Node, position } = currentNode
	if (Node) {
		for (const otherNode of otherNodesQuery) {
			if (Node.directions.includes(otherNode.ldtkEntityInstance.id)) {
				const arrowPosition = otherNode.position.clone().sub(position).normalize().multiplyScalar(16)
				const tween = new Tween(arrowPosition)
					.to(arrowPosition.clone().add(new Vector3(0, 1, 0)), 1000)
					.easing(Easing.Quadratic.InOut)
					.repeat(Number.POSITIVE_INFINITY)
					.yoyo(true)
				ecs.add({
					tween,
					parent: currentNode,
					position: arrowPosition,
					navArrow: true,
					sprite: new Sprite(getArrowSprite(arrowPosition)),
				})
			}
		}
	}
})
const navArrowQuery = ecs.with('navArrow')
export const removeNavigationArrows = () => navigatorQuery.onEntityRemoved.subscribe(() => {
	for (const entity of navArrowQuery) {
		ecs.remove(entity)
	}
})