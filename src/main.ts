import { app, overWorld } from './global/states'
import { time } from './lib/time'
import { spawnOverworld } from './states/overworld/spawnOverworld'

overWorld.onEnter(spawnOverworld)
app.enable(overWorld)
const animate = async (delta: number) => {
	time.tick(delta)
	app.update()
	requestAnimationFrame(animate)
}

animate(performance.now())
