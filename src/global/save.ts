import type LDTKEnums from '@/constants/exports/LDTKEnums'

interface SaveData {
	locks: typeof LDTKEnums['locks'][number][]
}
const blankSave = (): SaveData => ({
	locks: [],
})
export const save = blankSave()