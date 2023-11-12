import type { StandardProperties } from 'csstype'
import type { With } from 'miniplex'
import type { Entity } from '@/global/entity'
import { assets, ecs } from '@/global/init'
import { styles } from '@/lib/ui'
import { Nineslice } from '@/ui/nineslice'
import { getScreenBuffer } from '@/utils/buffer'
import { Selectable, SelectedArrow } from '@/ui/menu'
import { addTag } from '@/lib/hierarchy'

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
			<img src={assets.ui.hpbar.src} style={styles({ width: `${assets.ui.hpbar.width * 4}px`, ...props.style })}></img>
			<img class="health-bar" src={props.bar} style={styles({ width: `${len * 4}px`, height: '4px', position: 'absolute', left: '12px', top: '8px' })} />
		</div>
	)
}
export const characterCard = (player: With<Entity, 'currentHealth' | 'maxHealth'>) => () => (
	<Nineslice img="frameborder" margin={4} scale={4} style={{ width: 'fit-content', display: 'flex', alignItems: 'center', gap: '1vw', margin: '2vw' }}>
		<Nineslice img="label" margin={3} scale={4} style={{ display: 'flex', gap: '1vw', alignItems: 'center', height: 'fit-content' }}>
			<img src={assets.heroIcons.paladin.toDataURL()} style={styles({ width: '5vh', height: '5vh' })}></img>
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
const playerQuery = ecs.with('battleActions', 'currentTurn')
export const characterActions = () => (entity: With<Entity, 'menu' | 'menuId'>) => {
	const [player] = playerQuery
	if (player) {
		return (
			<Nineslice img="frameborder" margin={6} scale={4} style={{ position: 'fixed', left: 0, bottom: 0, margin: '2vw', gap: '1vw', display: 'grid' }}>
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
							{action.icon && <img src={action.icon.toDataURL()} style={styles({ width: `${assets.heroIcons.paladinAttack1.width * 4}px` })}></img>}
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
	return (
		<Selectable
			tag={identifier}
			menu={menu}
			onClick={() => enemy.target ? ecs.removeComponent(enemy, 'target') : addTag(enemy, 'target')}
		>
			<Nineslice
				img={menu.selectedElement === identifier ? 'itemspot-selected' : 'itemspot'}
				margin={3}
				scale={4}
				style={{ display: 'grid', gap: '1vh' }}
			>
				<b style={styles({ fontSize: '1.7rem', textTransform: 'capitalize' })}>{enemy.name}</b>
				<HpBar
					currentHealth={enemy.currentHealth}
					maxHealth={enemy.maxHealth}
					bar={hp}
				/>
			</Nineslice>
		</Selectable>
	)
}