
export interface Student {
    id: number
    promo: number
    firstName: string
    lastName: string
    mail?: string
    birthDate?: number
    archivedAt?: string
    phone?: string
    allowNotifications: boolean

    facebook?: string
    twitter?: string
    instagram?: string
    snapchat?: string

    picture?: string
    bio?: string
    archived: boolean
}
export interface StudentPreview {
    id: number
    promo: number
    firstName: string
    lastName: string
    picture?: string
}


export type StudentAdmin = Student & {
    roles: string[]
}


export interface StudentPreviewAdmin extends StudentPreview {
    roles: string[]
    archived: boolean
}



export type StudentAdminForm = {
    id: number
    promo: number
    roles: string[]
    firstName: string
    lastName: string
    birthDate?: Date
    mail?: string
    phone?: string
    picture?: File,
    resetPicture?: boolean
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
export type FilterReducerAction = NoActionReduction | ReducerPromoToggle | ReducerSearchUpdate;
