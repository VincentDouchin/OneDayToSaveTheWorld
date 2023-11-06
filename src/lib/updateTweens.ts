import { ecs } from '@/global/init'

const tweenQuery = ecs.with('tween')
export const updateTweens = () => {
	for (const { tween } of tweenQuery) {
		tween.update(Date.now())
	}
}
export const startTweens = () => tweenQuery.onEntityAdded.subscribe(({ tween }) => {
	tween.start(Date.now())
})