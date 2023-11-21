import { ecs } from "@/global/init"
import { save, updateSave } from "@/global/save"
import { addTag } from "@/lib/hierarchy"

const playerQuery = ecs.with('playerInputMap')
export const lockPlayer = () => {
    for (const player of playerQuery) {
        addTag(player, 'locked')
    }
}
export const unlockPlayer = () => {
    for (const player of playerQuery) {
        ecs.removeComponent(player, 'locked')
    }
}
export const pay = (amount: number) => {
    if (save.teams[save.currentTeam].money >= amount) {
        updateSave(s => s.teams[s.currentTeam].money -= amount)
        return true
    } else {
        return false
    }
}