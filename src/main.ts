import { adjustScreenSize, moveCamera, render, spawnCamera } from './global/camera'
import { initThree } from './global/rendering'
import { app, battleState, core, overWorldState } from './global/states'
import { playAnimations } from './lib/animations'
import { despawnOfType, hierarchyPlugin } from './lib/hierarchy'
import { InputMap } from './lib/inputs'
import { addToScene } from './lib/registerComponents'
import { spawnShadow, updateShadows } from './lib/shadows'
import { soundEffectsPlugin } from './lib/soundEffects'
import { time } from './lib/time'
import { transformsPlugin } from './lib/transforms'
import { removeUi, uiPlugin } from './lib/ui'
import { startTweens, updateTweens } from './lib/updateTweens'
import { battle, resetTurn, takeAction, targetSelectionMenu } from './states/battle/battle'
import { targetSelection } from './states/battle/selectTargets'
import { spawnBattleBackground } from './states/battle/spawnBattleBackground'
import { spawnBattlers } from './states/battle/spawnBattlers'
import { nativationArrows, navigate } from './states/overworld/navigation'
import { spawnOverworld } from './states/overworld/spawnOverworld'
import { spawnOverworldPlayer } from './states/overworld/spawnOverworldPlayer'
import { menuActivation, updateMenus } from './ui/menu'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera', 'sprite', 'cssObject', 'light'), transformsPlugin, uiPlugin, soundEffectsPlugin)
	.addSubscriber(startTweens, ...menuActivation, ...targetSelection, removeUi, spawnShadow)
	.onEnter(initThree, spawnCamera)
	.onPreUpdate(InputMap.update, updateTweens)
	.onUpdate(moveCamera, adjustScreenSize(), playAnimations, updateShadows, updateMenus)
	.onPostUpdate(render)
// ! Overworld
overWorldState
	.addSubscriber(...nativationArrows)
	.onEnter(spawnOverworld, spawnOverworldPlayer)
	.onUpdate(navigate)
	.onExit(despawnOfType('map'))
battleState
	.addSubscriber(...targetSelectionMenu, takeAction)
	.onEnter(spawnBattleBackground, spawnBattlers)
	.onUpdate(battle, resetTurn)

app.enable(core)
// app.enable(overWorldState)
app.enable(battleState)
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
