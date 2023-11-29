import { BattleUi } from '@/states/battle/battleUi'
import { OverworldUi } from '@/states/overworld/overworldUi'

export const UI = () => (
	<>
		<OverworldUi />
		<BattleUi />
	</>
)
