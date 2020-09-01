import {EmbedEnumType} from "../post/types"

export type Poll = {
    id: number
    options: string[]
    results: number[]
    multiple: boolean
    anonymous: boolean
    embedType: EmbedEnumType.POLL
}