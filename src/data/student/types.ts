export interface Student {
    id: number
    promo: number
    firstName: string
    lastName: string
    mail?: string
    birthDate?: number
    archivedAt?: string
    phoneNumber?: string
    allowNotifications: boolean

    facebook?: string
    twitter?: string
    instagram?: string
    snapchat?: string

    picture?: string
    photoUrl?: string
    photoUrlThumb?: string
    bio?: string
    archived: boolean
}


export type StudentAdmin = Student & {
    roles: string[]
}

export interface StudentPreview {
    id: number
    promo: number
    firstName: string
    lastName: string
    picture?: string
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
