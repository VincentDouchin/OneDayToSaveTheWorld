import { adjustScreenSize, moveCamera, render, spawnCamera } from './global/camera'
import { initThree } from './global/rendering'
import { app, battleState, core, overWorldState } from './global/states'
import { playAnimations } from './lib/animations'
import { despawnOfType, hierarchyPlugin } from './lib/hierarchy'
import { InputMap } from './lib/inputs'
import { addToScene } from './lib/registerComponents'
import { time } from './lib/time'
import { transformsPlugin } from './lib/transforms'
import { uiPlugin } from './lib/ui'
import { startTweens, updateTweens } from './lib/updateTweens'
import { battle } from './states/battle/battle'
import { spawnBattleBackground } from './states/battle/spawnBattleBackground'
import { spawnBattlers } from './states/battle/spawnBattlers'
import { createNavigationArrows, navigate, removeNavigationArrows } from './states/overworld/navigation'
import { spawnOverworld } from './states/overworld/spawnOverworld'
import { spawnOverworldPlayer } from './states/overworld/spawnOverworldPlayer'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera', 'sprite', 'cssObject'), transformsPlugin, uiPlugin)
	.onEnter(initThree, spawnCamera, startTweens)
	.onPreUpdate(InputMap.update, updateTweens)
	.onUpdate(moveCamera, adjustScreenSize(), playAnimations)
	.onPostUpdate(render)
// ! Overworld
overWorldState
	.onEnter(spawnOverworld, spawnOverworldPlayer, createNavigationArrows, removeNavigationArrows)
	.onUpdate(navigate)
	.onExit(despawnOfType('map'))
battleState
	.onEnter(spawnBattleBackground, spawnBattlers)
	.onUpdate(battle)

app.enable(core)
// app.enable(overWorldState)
app.enable(battleState)
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
