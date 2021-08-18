
type ChoiceForm = {
    id?: number
    content: string
}

export type PollCreation = {
    title: string
    choices: Array<ChoiceForm>
    multiple: boolean
    anonymous: boolean
    endsAt: Date
}

export type PollEdition = {
    title: string
    choices: Array<ChoiceForm>
    multiple: boolean
    anonymous: boolean
    endsAt: Date
}


export type PollChoice = {
    id: number,
    content: string,
    votesNumber: number,
    voters?: number[]
}

export type Poll = {
    id: number
    title: string
    endsAt: Date
    choices: PollChoice[]
    multiple: boolean
    anonymous: boolean
}
