import { adjustScreenSize, moveCamera, render, spawnCamera } from './global/camera'
import { addToScene } from './lib/registerComponents'
import { initThree } from './global/rendering'
import { app, battleState, core, overWorldState } from './global/states'
import { despawnOfType, hierarchyPlugin } from './lib/hierarchy'
import { time } from './lib/time'
import { transformsPlugin } from './lib/transforms'
import { spawnOverworld } from './states/overworld/spawnOverworld'
import { spawnOverworldPlayer } from './states/overworld/spawnOverworldPlayer'
import { playAnimations } from './lib/animations'
import { InputMap } from './lib/inputs'
import { createNavigationArrows, navigate, removeNavigationArrows } from './states/overworld/navigation'
import { startTweens, updateTweens } from './lib/updateTweens'
import { spawnBattleBackground } from './states/battle/spawnBattleBackground'
import { spawnBattlers } from './states/battle/spawnBattlers'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera', 'sprite'), transformsPlugin)
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

app.enable(core)
// app.enable(overWorldState)
app.enable(battleState)
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
