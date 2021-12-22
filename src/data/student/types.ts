export type StudentPicture = {
    original?: string
    custom?: string
}

export interface Student {
    id: number
    feedId: number
    promo: number
    firstName: string
    lastName: string
    mail?: string
    birthDate?: number
    archivedAt?: string
    notification: boolean
    recognition: boolean

    facebook?: string
    twitter?: string
    instagram?: string
    snapchat?: string

    pictures: StudentPicture
    bio?: string
    archived: boolean
    lastConnection: Date

    unwatchedNotifications: number
}
export interface StudentPreview {
    id: number
    feedId: number
    promo: number
    firstName: string
    lastName: string
    unwatchedNotifications: number
    picture?: string
}

export interface StudentsImportData {
    student: StudentPreview,
    file?: Blob
}

export type StudentAdmin = Student & {
    roles: string[]
}


export interface StudentPreviewAdmin extends StudentPreview {
    roles: string[]
    archived: boolean
}


export type StudentOverview = StudentPreview & {
    bio?: string
    mail?: string
    archived: boolean

    facebook?: string
    twitter?: string
    instagram?: string
    snapchat?: string
}

export type StudentSettings = {
    language: string
    recognition: boolean
    notification: boolean
}

export type StudentAdminForm = {
    id: number
    promo: number
    roles: string[]
    firstName: string
    lastName: string
    birthDate?: Date
    mail?: string
}

type ReducerPromoToggle = {
    type: "ADD_PROMO" | "REMOVE_PROMO",
    promo: number
}

type ReducerSearchUpdate = {
    type: "UPDATE_SEARCH",
    name: string
}
type NoActionReduction = {
    type: "TOGGLE_SORT" | "INIT_FILTER",
}
export type FilterReducerAction = NoActionReduction | ReducerPromoToggle | ReducerSearchUpdate
