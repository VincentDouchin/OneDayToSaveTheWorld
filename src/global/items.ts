export type ItemData = KeyItem

export interface KeyItem {
    type: 'key'
    name: string
}

export const beer = (): ItemData => ({
    type: 'key',
    name: 'beer'
})