import type { StandardProperties } from 'csstype'
import type { With } from 'miniplex'
import { allTargetsSelected } from './battle'
import { currentActionQuery, currentTurnQuery, getPossibleTargets, targetQuery } from './battleQueries'
import { BattlerType } from './battlerBundle'
import { context } from '@/global/context'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { addTag } from '@/lib/hierarchy'
import { textStroke } from '@/lib/ui'
import { Selectable, SelectedArrow } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { sleep } from '@/utils/sleep'

const HP = '#17b81e'
const SP = '#4779d5'
const HpBar = (props: { style?: Partial<StandardProperties>; currentHealth: number; maxHealth: number; color: string }) => {
	const len = props.currentHealth / props.maxHealth * 26
	return (
		<div style="position:relative">
			<PixelImage img={assets.ui.hpbar}></PixelImage>
			<div
				style={{
					width: `${len * 4}px`,
					backgroundColor: props.color,
					height: `${context.uiScale}rem`,
					position: 'absolute',
					left: `${3 * context.uiScale}rem`,
					top: `${2 * context.uiScale}rem`,
				}}
			/>
		</div>
	)
}
export const characterCard = (character: 'paladin') => (player: With<Entity, 'currentHealth' | 'maxHealth'>) => (
	<Nineslice
		img="frameborder"
		margin={4}
		style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '1rem', margin: '2rem' }}
	>
		<Nineslice
			img="label"
			margin={3}
			style={{ display: 'flex', gap: '1rem', alignItems: 'center', height: 'fit-content' }}
		>
			<PixelImage img={assets.heroIcons[character]} />
			<span style={{ fontSize: '2rem', textTransform: 'capitalize' }}>{character}</span>
		</Nineslice>
		<div>
			<div style="font-size:1.7rem">{`HP ${player.currentHealth}/${player.maxHealth}`}</div>
			<HpBar
				currentHealth={player.currentHealth}
				maxHealth={player.maxHealth}
				color={HP}
			/>
			<div style="font-size:1.7rem">{`SP ${player.currentHealth}/${player.maxHealth}`}</div>
			<HpBar
				currentHealth={player.currentHealth}
				maxHealth={player.maxHealth}
				color={SP}
			/>
		</div>
	</Nineslice>
)
const playerQuery = ecs.with('battleActions', 'currentTurn', 'battler').where(({ battler }) => battler === BattlerType.Player)
export const characterActions = (entity: With<Entity, 'menu' | 'menuId'>) => {
	const [player] = playerQuery
	if (player) {
		return (
			<Nineslice
				img="frameborder"
				margin={6}
				style={{ position: 'fixed', left: 0, bottom: 0, margin: '2vw', gap: '1vw', display: 'grid' }}
				className="slide-in"
			>
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
							style={{ display: 'flex', gap: '1vw', placeItems: 'center' }}
						>
							{action.icon && (<PixelImage img={action.icon} />)}
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
					assets.uiSounds.Hover_06.play()
				})
			}
		}
	}
	return (
		<Selectable
			tag={identifier}
			menu={menu}
			onClick={selectEnemy}
			selectable={currentTurnQuery.first?.battler === BattlerType.Player}
		>
			<Nineslice
				img={menu.selectedElement === identifier ? 'itemspot-selected' : 'itemspot'}
				margin={3}
				style={{ display: 'grid', gap: '1vh' }}
			>
				<b style={{ fontSize: '1.7rem', textTransform: 'capitalize' }}>{enemy.name}</b>
				<HpBar
					currentHealth={enemy.currentHealth}
					maxHealth={enemy.maxHealth}
					color={HP}
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
					style={{ padding: '2vh' }}
				>
					<div>{allTargetsSelected() ? 'Attack' : `Select Targets ${targets}/${maxTargets}`}</div>
				</Nineslice>
			</Selectable>
		)
	}
}

export const damageNumber = (amount: number, style: { opacity: number }) => () => <b style={{ fontSize: '2rem', color: amount < 0 ? 'red' : '#33cc33', opacity: `${style.opacity}%`, ...textStroke('white') }}>{amount}</b>

export const battleEndScreen = (money: number) => () => {
	return (
		<Nineslice
			img="frameornate"
			margin={12}
			style={{ position: 'fixed', top: '50%', left: '50%', translate: '-50% -50%', display: 'grid', gap: '3rem', textAlign: 'center' }}
		>
			<div style={{ fontSize: '6rem', fontWeight: 'bold' }}>You won!</div>
			<div style={{ fontSize: '3rem' }}>
				You gained
				{' '}
				{money}
				{' '}
				<PixelImage img={assets.ui.coin} />
			</div>
		</Nineslice>
	)
}