import { render, spawnCamera } from './global/camera'
import { addToScene } from './global/registerComponents'
import { initThree } from './global/rendering'
import { app, core, overWorld } from './global/states'
import { hierarchyPlugin } from './lib/hierarchy'
import { time } from './lib/time'
import { transformsPlugin } from './lib/transforms'
import { spawnOverworld } from './states/overworld/spawnOverworld'

// ! Core
core
	.addPlugins(hierarchyPlugin, addToScene('camera'), transformsPlugin)
	.onEnter(initThree, spawnCamera)
	.onPostUpdate(render)
// ! Overworld
overWorld
	.onEnter(spawnOverworld)

app.enable(core)
app.enable(overWorld)

const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
