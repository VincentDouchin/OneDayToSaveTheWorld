import type { StandardProperties } from 'csstype'
import type { With } from 'miniplex'
import { allTargetsSelected, currentActionQuery, getPossibleTargets, targetQuery } from './battle'
import { BattlerType } from './battlerBundle'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'
import { Selectable, SelectedArrow } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { getScreenBuffer } from '@/utils/buffer'
import { sleep } from '@/utils/sleep'

const getBar = (color: string) => {
	const buffer = getScreenBuffer(1, 1)
	buffer.fillStyle = color
	buffer.fillRect(0, 0, 1, 1)
	return buffer.canvas.toDataURL()
}
const hp = getBar('#17b81e')
const sp = getBar('#4779d5')
const HpBar = (props: { style?: Partial<StandardProperties>; currentHealth: number; maxHealth: number; bar: string }) => {
	const len = props.currentHealth / props.maxHealth * 26
	return (
		<div style="position:relative">
			<img src={assets.ui.hpbar.src} style={{ width: `${assets.ui.hpbar.width * 4}px`, ...props.style }}></img>
			<img class="health-bar" src={props.bar} style={{ width: `${len * 4}px`, height: '4px', position: 'absolute', left: '12px', top: '8px' }} />
		</div>
	)
}
export const characterCard = (player: With<Entity, 'currentHealth' | 'maxHealth'>) => (
	<Nineslice img="frameborder" margin={4} scale={4} style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '1vw', margin: '2vw' }}>
		<Nineslice img="label" margin={3} scale={4} style={{ display: 'flex', gap: '1vw', alignItems: 'center', height: 'fit-content' }}>
			<img src={assets.heroIcons.paladin.url} style={{ width: '5vh', height: '5vh' }}></img>
			<span style="font-size:2rem">Paladin</span>
		</Nineslice>
		<div>
			<div style="font-size:1.7rem">{`HP ${player.currentHealth}/${player.maxHealth}`}</div>
			<HpBar currentHealth={player.currentHealth} maxHealth={player.maxHealth} bar={hp}></HpBar>
			<div style="font-size:1.7rem">{`SP ${player.currentHealth}/${player.maxHealth}`}</div>
			<HpBar currentHealth={player.currentHealth} maxHealth={player.maxHealth} bar={sp}></HpBar>
		</div>
	</Nineslice>
)
const playerQuery = ecs.with('battleActions', 'currentTurn', 'battler').where(({ battler }) => battler === BattlerType.Player)
export const characterActions = (entity: With<Entity, 'menu' | 'menuId'>) => {
	const [player] = playerQuery
	if (player) {
		return (
			<Nineslice img="frameborder" margin={6} scale={4} style={{ position: 'fixed', left: 0, bottom: 0, margin: '2vw', gap: '1vw', display: 'grid' }} className="slide-in">
				{player.battleActions.map(action => (
					<Selectable
						menu={entity}
						tag={action.label}
						onClick={() => 	{
							ecs.addComponent(player, 'currentAction', action)
							ecs.removeComponent(entity, 'menu')
						}}
					>
						<Nineslice
							img={entity.selectedElement === action.label ? 'itemspot-selected' : 'itemspot'}
							margin={3}
							scale={4}
							style={{ display: 'flex', gap: '1vw', placeItems: 'center' }}
						>
							{action.icon && <img src={action.icon} style={{ width: `${assets.heroIcons.paladinAttack1.canvas.width * 4}px` }}></img>}
							<span style="font-size:1.8rem">{action.label}</span>
						</Nineslice>
					</Selectable>
				))}
				<SelectedArrow entity={entity}></SelectedArrow>
			</Nineslice>
		)
	}
}
export const enemyHpBar = (menu: With<Entity, 'menuId'>, index: number) => (enemy: With<Entity, 'currentHealth' | 'maxHealth' | 'name'>) => {
	const identifier = `${enemy.name}${index}`
	const selectEnemy = () => {
		if (enemy.target) {
			ecs.removeComponent(enemy, 'target')
		} else {
			if (!allTargetsSelected()) {
				addTag(enemy, 'target')
			}
			if (allTargetsSelected()) {
				sleep(100).then(() => {
					menu.selectedElement = 'attack'
				})
			}
		}
	}
	return (
		<Selectable
			tag={identifier}
			menu={menu}
			onClick={selectEnemy}
		>
			<Nineslice
				img={menu.selectedElement === identifier ? 'itemspot-selected' : 'itemspot'}
				margin={3}
				scale={4}
				style={{ display: 'grid', gap: '1vh' }}
			>
				<b style={{ fontSize: '1.7rem', textTransform: 'capitalize' }}>{enemy.name}</b>
				<HpBar
					currentHealth={enemy.currentHealth}
					maxHealth={enemy.maxHealth}
					bar={hp}
				/>
			</Nineslice>
		</Selectable>
	)
}
const playerAction = currentActionQuery.with('battler').where(({ battler }) => battler === BattlerType.Player)
export const BattlerDirections = (menu: With<Entity, 'menuId'>) => () => {
	const player = playerAction.first
	if (player?.currentAction) {
		const possibleTargets = getPossibleTargets().length
		const targets = targetQuery.size
		const maxTargets = Math.min(player.currentAction?.targetAmount, possibleTargets)
		return (
			<Selectable
				menu={menu}
				tag="attack"
				selectable={allTargetsSelected()}
				onClick={() => { addTag(player, 'takingAction'); ecs.removeComponent(menu, 'menu') }}
				style={{ width: 'fit-content', position: 'absolute', left: '50%', translate: '-50%', bottom: '1rem', fontSize: '2rem' }}
			>
				<Nineslice
					img="frameborder"
					margin={4}
					scale={4}
					style={{ padding: '2vh' }}
				>
					<div>{allTargetsSelected() ? 'Attack' : `Select Targets ${targets}/${maxTargets}`}</div>
				</Nineslice>
			</Selectable>
		)
	}
}