import { adjustScreenSize, moveCamera, render, spawnCamera } from './global/camera'
import { initThree } from './global/rendering'
import { spawnLight } from './global/spawnLights'
import { app, battleEnterState, battleExitState, battleState, core, overWorldState } from './global/states'
import { setAtlasTexture, setCurrentAtlas, tickAnimations } from './lib/animations'
import { despawnOfType, hierarchyPlugin } from './lib/hierarchy'
import { InputMap } from './lib/inputs'
import { changeTextureOnHover, clickOnEntity, updatePointers } from './lib/interactions'
import { addToScene } from './lib/registerComponents'
import { spawnShadow, updateShadows } from './lib/shadows'
import { setGlobalVolume, soundEffectsPlugin } from './lib/soundEffects'
import { time } from './lib/time'
import { transformsPlugin } from './lib/transforms'
import { removeUi, uiPlugin } from './lib/ui'
import { startTweens, updateTweens } from './lib/updateTweens'
import { battle, battleEnter, battleExit, endBattle, resetTurn, selectBattler, takeAction, targetSelectionMenu } from './states/battle/battle'
import { targetSelection } from './states/battle/selectTargets'
import { spawnBattleBackground } from './states/battle/spawnBattleBackground'
import { spawnBattlers } from './states/battle/spawnBattlers'
import { nativationArrows, navigate } from './states/overworld/navigation'
import { spawnOverWorldUi } from './states/overworld/overworldUi'
import { spawnOverworld } from './states/overworld/spawnOverworld'
import { spawnOverworldPlayer } from './states/overworld/spawnOverworldPlayer'
import { menuActivation, updateMenus } from './ui/menu'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera', 'sprite', 'cssObject', 'light'), transformsPlugin, uiPlugin, soundEffectsPlugin)
	.addSubscriber(startTweens, ...menuActivation, ...targetSelection, removeUi, spawnShadow)
	.onEnter(initThree, spawnCamera, spawnLight, setGlobalVolume)
	.onPreUpdate(InputMap.update, updateTweens, updatePointers)
	.onUpdate(moveCamera, adjustScreenSize(), tickAnimations, setCurrentAtlas, setAtlasTexture, changeTextureOnHover, updateShadows, updateMenus, clickOnEntity)
	.onPostUpdate(render)

// ! Overworld
overWorldState
	.addSubscriber(...nativationArrows)
	.onEnter(spawnOverworld, spawnOverworldPlayer, spawnOverWorldUi)
	.onUpdate(navigate)
	.onExit(despawnOfType('map'))
battleEnterState
	.onEnter(spawnBattleBackground, spawnBattlers, battleEnter)
battleState
	.addSubscriber(...targetSelectionMenu, takeAction)
	.onUpdate(battle, resetTurn, selectBattler, endBattle)
battleExitState
	.onEnter(battleExit)
	.onExit(despawnOfType('battleBackground'))

core.enable()
overWorldState.enable({})
// battleEnterState.enable({ battle: 'Bear' })
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
