import { ColliderDesc, RigidBodyDesc } from '@dimforge/rapier2d-compat'
import { characterAnimationBundle } from '@/lib/animations'
import { playerInputMap } from '@/global/inputMaps'
import type { Entity } from '@/global/entity'

export const dungeonPlayerBundle = () => {
	return {
		...characterAnimationBundle('paladin', 'idle', 'right', 'down'),
		...playerInputMap(),
		colliderDesc: ColliderDesc.cuboid(4, 4),
		bodyDesc: RigidBodyDesc.dynamic().setLinearDamping(5),
		cameraTarget: true,
		justEntered: true,
		shadow: true,
		ySorted: true,
		cameraTargetOffset: 'down',
	} as const satisfies Entity
}