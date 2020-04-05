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


    photoUrl?: string;
    photoUrlThumb?: string;
    bio?: string;
    archived: boolean;
    flatRoles?: String[];
}

export type StudentAdminForm = {
    id: number
    promo: string
    firstName: string
    lastName: string
    birthDate?: Date
    mail?: string
    thumbnail?: File
}
