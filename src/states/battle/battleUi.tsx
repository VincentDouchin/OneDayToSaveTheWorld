import type { StandardProperties } from 'csstype'
import type { With } from 'miniplex'
import { BattlerType } from './battlerBundle'
import { context } from '@/global/context'
import type { Entity } from '@/global/entity'
import { assets, ecs, ui } from '@/global/init'
import { battleState } from '@/global/states'
import { textStroke } from '@/lib/uiManager'
import { ForQuery } from '@/ui/forQuery'
import { Menu } from '@/ui/menu'
import { Nineslice } from '@/ui/nineslice'
import { PixelImage } from '@/ui/pixelImage'
import { StateUi } from '@/ui/state'

const HP = '#17b81e'
const SP = '#4779d5'
const HpBar = (props: { style?: Partial<StandardProperties>; currentHealth: number; maxHealth: number; color: string }) => {
	const len = props.currentHealth / props.maxHealth * 26
	return (
		<div style="position:relative">
			<PixelImage img={assets.ui.hpbar}></PixelImage>
			<div
				style={{
					'width': `${len * 4}px`,
					'background-color': props.color,
					'height': `${context.uiScale}rem`,
					'position': 'absolute',
					'left': `${3 * context.uiScale}rem`,
					'top': `${2 * context.uiScale}rem`,
				}}
			/>
		</div>
	)
}
export const CharacterCard = (props: { player: With<Entity, 'currentHealth' | 'maxHealth' | 'character'> }) => {
	const icon = props.player.character === 'paladin' && assets.heroIcons[props.player.character]
	return (
		<Nineslice
			img="frameborder"
			margin={4}
			style={{ 'width': 'fit-content', 'height': 'fit-content', 'display': 'flex', 'align-items': 'center', 'gap': '1rem', 'margin': '2rem' }}
		>
			<Nineslice
				img="label"
				margin={3}
				style={{ 'display': 'flex', 'gap': '1rem', 'align-items': 'center', 'height': 'fit-content' }}
			>
				{icon ? <PixelImage img={icon} /> : <></>}
				<span style={{ 'font-size': '2rem', 'text-transform': 'capitalize' }}>{props.player.character}</span>
			</Nineslice>
			<div>
				<div style="font-size:1.7rem">{`HP ${props.player.currentHealth}/${props.player.maxHealth}`}</div>
				<HpBar
					currentHealth={props.player.currentHealth}
					maxHealth={props.player.maxHealth}
					color={HP}
				/>
				<div style="font-size:1.7rem">{`SP ${props.player.currentHealth}/${props.player.maxHealth}`}</div>
				<HpBar
					currentHealth={props.player.currentHealth}
					maxHealth={props.player.maxHealth}
					color={SP}
				/>
			</div>
		</Nineslice>
	)
}
export const CharacterActions = (props: { player: With<Entity, 'battleActions' | 'currentTurn' | 'battler' | 'menuInputMap'> }) => {
	return (
		<Nineslice
			img="frameborder"
			margin={6}
			style={{ position: 'fixed', left: 0, bottom: 0, margin: '2vw', gap: '1vw', display: 'grid' }}
		>
			<Menu
				items={props.player.battleActions}
				inputs={props.player.menuInputMap}
				onValidate={action => ecs.addComponent(props.player, 'currentAction', action)}
			>
				{({ selected, data }) => (
					<Nineslice
						img={selected() ? 'itemspot-selected' : 'itemspot'}
						margin={3}
						style={{ 'display': 'flex', 'gap': '1vw', 'place-items': 'center' }}
					>
						{data.icon && (<PixelImage img={data.icon} />)}
						<span style="font-size:1.8rem">
							{data.label}
						</span>
					</Nineslice>
				)}
			</Menu>
		</Nineslice>
	)
}
const enemiesQuery = ecs.with('currentHealth', 'maxHealth', 'battler').where(({ battler }) => battler === BattlerType.Enemy)
export const EnemyHealthBars = () => {
	const enemies = ui.sync(() => [...enemiesQuery])
	return (
		<Menu
			items={enemies() ?? []}
			onValidate={() => console.log('ok')}
		>
			{({ selected, data }) => (
				<Nineslice
					img={selected() ? 'itemspot-selected' : 'itemspot'}
					margin={3}
					style={{ display: 'grid', gap: '1vh' }}
				>
					<b style={{ 'font-size': '1.7rem', 'text-transform': 'capitalize' }}>{data.name}</b>
					<HpBar
						currentHealth={data.currentHealth}
						maxHealth={data.maxHealth}
						color={HP}
					/>
				</Nineslice>
			)}
		</Menu>
	)
}
// const playerAction = currentActionQuery.with('battler').where(({ battler }) => battler === BattlerType.Player)
// export const BattlerDirections = (menu: With<Entity, 'menuId'>) => () => {
// 	const player = playerAction.first
// 	if (player?.currentAction) {
// 		const possibleTargets = getPossibleTargets().length
// 		const targets = targetQuery.size
// 		const maxTargets = Math.min(player.currentAction?.targetAmount, possibleTargets)
// 		return (
// 			<Selectable
// 				menu={menu}
// 				tag="attack"
// 				selectable={allTargetsSelected()}
// 				onClick={() => { addTag(player, 'takingAction'); ecs.removeComponent(menu, 'menu') }}
// 				style={{ width: 'fit-content', position: 'absolute', left: '50%', translate: '-50%', bottom: '1rem', fontSize: '2rem' }}
// 			>
// 				<Nineslice
// 					img="frameborder"
// 					margin={4}
// 					style={{ padding: '2vh' }}
// 				>
// 					<div>{allTargetsSelected() ? 'Attack' : `Select Targets ${targets}/${maxTargets}`}</div>
// 				</Nineslice>
// 			</Selectable>
// 		)
// 	} else {
// 		return <></>
// 	}
// }

export const damageNumber = (amount: number, style: { opacity: number }) => () => <b style={{ 'font-size': '2rem', 'color': amount < 0 ? 'red' : '#33cc33', 'opacity': `${style.opacity}%`, ...textStroke('white') }}>{amount}</b>

export const battleEndScreen = (money: number) => () => {
	return (
		<Nineslice
			img="frameornate"
			margin={12}
			style={{ 'position': 'fixed', 'top': '50%', 'left': '50%', 'translate': '-50% -50%', 'display': 'grid', 'gap': '3rem', 'text-align': 'center' }}
		>
			<div style={{ 'font-size': '6rem', 'font-weight': 'bold' }}>You won!</div>
			<div style={{ 'font-size': '3rem' }}>
				You gained
				{' '}
				{money}
				{' '}
				<PixelImage img={assets.ui.coin} />
			</div>
		</Nineslice>
	)
}
const characterQuery = ecs.with('currentHealth', 'maxHealth', 'character').where(({ character }) => character === 'paladin')
const playerCurrentTurnQuery = ecs.with('battler', 'currentTurn', 'battleActions', 'menuInputMap').where(({ battler }) => battler === BattlerType.Player)

export const BattleUi = () => {
	return (
		<StateUi state={battleState}>
			<ForQuery query={characterQuery}>
				{player => <CharacterCard player={player}></CharacterCard>}
			</ForQuery>
			<ForQuery query={playerCurrentTurnQuery}>
				{player => <CharacterActions player={player}></CharacterActions>}
			</ForQuery>
			<EnemyHealthBars />
		</StateUi>
	)
}