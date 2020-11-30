
export type PollCreation = {
    title: string
    options: string[]
    multiple: boolean
    anonymous: boolean
}

export type Poll = {
    id: number
    options: string[]
    results: number[]
    multiple: boolean
    anonymous: boolean
}