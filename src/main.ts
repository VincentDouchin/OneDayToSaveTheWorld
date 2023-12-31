import { debug } from './debug'
import { adjustScreenSize, moveCamera, render, setInitialTargetPosition, spawnCamera } from './global/camera'
import { time, ui } from './global/init'
import { initThree } from './global/rendering'
import { spawnLight } from './global/spawnLights'
import { app, battleEnterState, battleExitState, battleState, core, dungeonState, overWorldState, setupState } from './global/states'
import { setAtlasTexture, setCurrentAtlas, tickAnimations } from './lib/animations'
import { despawnOfType, hierarchyPlugin } from './lib/hierarchy'
import { InputMap } from './lib/inputs'
import { changeTextureOnHover, clickOnEntity, updatePointers } from './lib/interactions'
import { particlesPlugin } from './lib/particles'
import { physicsPlugin, stepWorld } from './lib/physics'
import { addToScene } from './lib/registerComponents'
import { spawnShadow, updateShadows } from './lib/shadows'
import { setGlobalVolume, soundEffectsPlugin } from './lib/soundEffects'
import { transformsPlugin, updateGroupPosition, updatePosition } from './lib/transforms'
import { startTweens, updateTweens } from './lib/updateTweens'
import { battle, battleEnter, battleExit, endBattle, resetTurn, selectBattler, takeAction, targetSelectionMenu } from './states/battle/battle'
import { targetSelection } from './states/battle/selectTargets'
import { spawnBattleBackground } from './states/battle/spawnBattleBackground'
import { spawnBattlers } from './states/battle/spawnBattlers'
import { displayBubble } from './states/dungeon/dialog'
import { exitDungeon } from './states/dungeon/exitDungeon'
import { movePlayer } from './states/dungeon/movePlayer'
import { spawnDungeon } from './states/dungeon/spawnDungeon'
import { setupGame } from './states/gameStart/setupGame'
import { nativationArrows, navigate } from './states/overworld/navigation'
import { spawnOverworld } from './states/overworld/spawnOverworld'
import { spawnOverworldPlayer } from './states/overworld/spawnOverworldPlayer'
import { menuActivation, updateMenus } from './ui/menu'
import { UI } from './ui/ui'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera', 'sprite', 'cssObject', 'light', 'emitter'), soundEffectsPlugin, physicsPlugin, transformsPlugin, particlesPlugin, ui.render(UI))
	.addSubscriber(startTweens, ...menuActivation, ...targetSelection, spawnShadow)
	.onEnter(initThree, spawnCamera, spawnLight, setGlobalVolume)
	.onPreUpdate(updatePosition, InputMap.update, updateTweens, updatePointers, ui.update)
	.onUpdate(adjustScreenSize(), tickAnimations, setCurrentAtlas, setAtlasTexture, changeTextureOnHover, updateShadows, updateMenus, clickOnEntity)
	.onPostUpdate(updateGroupPosition, render, stepWorld, moveCamera)
	.onPostUpdate()

// ! Setup
setupState
	.onEnter(setupGame)
// ! Overworld
overWorldState
	.addSubscriber(...nativationArrows)
	.onEnter(spawnOverworld, spawnOverworldPlayer, setInitialTargetPosition)
	.onUpdate(navigate)
	.onExit(despawnOfType('map'))

// ! Battle
battleEnterState
	.onEnter(spawnBattleBackground, spawnBattlers, battleEnter, setInitialTargetPosition)
battleState
	.addSubscriber(...targetSelectionMenu, takeAction)
	.onUpdate(battle, resetTurn, selectBattler, endBattle)
battleExitState
	.onEnter(battleExit)
	.onExit(despawnOfType('battleBackground'))

// ! Dungeon
dungeonState
	.onEnter(spawnDungeon, stepWorld, setInitialTargetPosition)
	.onUpdate(movePlayer, exitDungeon, displayBubble)
	.onExit(despawnOfType('dungeonMap'))
debug()
core.enable()
setupState.enable()
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
