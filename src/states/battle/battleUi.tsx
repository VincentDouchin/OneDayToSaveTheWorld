import type { With } from 'miniplex'
import { createElement } from 'inferno-create-element'
import type { StandardProperties } from 'csstype'
import { Nineslice } from '@/ui/nineslice'
import type { Entity } from '@/global/entity'
import { assets } from '@/global/init'
import { styles } from '@/lib/ui'
import { getScreenBuffer } from '@/utils/buffer'

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
export const characterActions = () => () => (
	<Nineslice img="frameborder" margin={6} scale={4} style={{ position: 'fixed', left: 0, bottom: 0, margin: '2vw', gap: '1vw', display: 'grid' }}>
		<Nineslice img="itemspot" margin={3} scale={4} style={{ display: 'flex', gap: '1vw', placeItems: 'center' }}>
			<img src={assets.heroIcons.paladinAttack1.toDataURL()} style={styles({ width: `${assets.heroIcons.paladinAttack1.width * 4}px` })}></img>
			<span style="font-size:1.8rem">Attack</span>
		</Nineslice>
		<Nineslice img="itemspot" margin={3} scale={4} style={{ display: 'flex', gap: '1vw', placeItems: 'center' }}>
			<img src={assets.heroIcons.paladinAttack2.toDataURL()} style={styles({ width: `${assets.heroIcons.paladinAttack2.width * 4}px` })}></img>
			<span style="font-size:1.8rem">Blades</span>
		</Nineslice>
	</Nineslice>
)
export const enemyHpBar = (enemy: With<Entity, 'currentHealth' | 'maxHealth'>) => () => <HpBar currentHealth={enemy.currentHealth} maxHealth={enemy.maxHealth} bar={hp}></HpBar>