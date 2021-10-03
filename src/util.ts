import {useLocation} from "react-router-dom"
import {Entity} from "./data/request.type"
import {format, formatDistance} from "date-fns"
import {enUS, fr} from "date-fns/locale"
import {Image as ImageType} from "./data/media/types"
import {PhotoProps} from "react-photo-gallery"
import {GallerySizes} from "./constants/MediaSizes"
import { TFunction } from "i18next"
import { formatWithOptions } from "date-fns/fp"
import axios from "axios"

const locales: { [id: string]: Locale } = {
    en: enUS,
    fr
}
export const _format = (date: Date | number, formatStr = "PP"): string =>
    format(date, formatStr, {
        locale: locales[localStorage.getItem("lng") || "fr"]
    })

export const formatDate = (date: Date, t: TFunction): [string, number] => {
    const now = new Date()

    const timezoneOffset = now.getTimezoneOffset() * -60_000

    const nowS = (now.getTime() + timezoneOffset) / 1000
    const dateS = (date.getTime() + timezoneOffset) / 1000

    const nowDay = Math.floor(nowS / 60 / 60 / 24)
    const dateDay = Math.floor(dateS / 60 / 60 / 24)

    const diff = nowS - dateS
    if (diff / 60 / 60 < 24) {//Less than 24h ago
        if(diff < 60 * 1.5)//Less than 1.5 min ago
            return [t("just_now"), (60 * 1.5 - diff) * 1_000]
        else if (diff / 60 < 60)// Less than 1 hour ago
            return [`${Math.floor(diff / 60)} min`, (60 - diff % 60) * 1_000]
        else
            return [`${Math.floor(diff / 60 / 60)} h`, (60*60 - diff % (60*60)) * 1_000]
    } else if (nowDay == dateDay + 1)//Yesterday
        return [`${t("yesterday")} ${format(date, "HH:mm")}`, (60 * 60 * 24 - dateS % (60 * 60 * 24)) * 1_000]
    else if (now.getFullYear() == date.getFullYear())//This year
        return [formatWithOptions({ locale: fr }, "d MMMM, HH:MM")(date), -1]
    else
        return [formatWithOptions({ locale: fr }, "d MMMM YYYY, HH:MM")(date), -1]
}


export const _formatDistance = (date: Date | number, baseDate: Date | number, options?: {
    includeSeconds?: boolean
    addSuffix?: boolean
    locale?: Locale
}): string => formatDistance(date, baseDate, {
    locale: locales[localStorage.getItem("lng") || "fr"],
    ...options
})


export const handleRequestCancellation = (e: Error): void | Error => {
    if (axios.isCancel(e))
        console.debug(e.message)
    else throw new Error(e.message)
}


const reISO = /^(\d{4})-(\d{2})-(\d{2})T(\d{2}):(\d{2}):(\d{2}(?:\.\d*))(?:Z|([+-])([\d|:]*))?$/
const reMsAjax = /^\/Date\((d|-|.*)\)[/|\\]$/
export const JSONDateParser = (key: string, value: unknown): Date | unknown => {
    if (typeof value === "string") {
        let a = reISO.exec(value)
        if (a)
            return new Date(value)

        a = reMsAjax.exec(value)
        if (a) {
            const b = a[1].split(/[-+,.]/)
            return new Date(b[0] ? +b[0] : 0 - +b[1])
        }
    }
    return value
}


export const randomBackgroundColors = (): string => {
    const colors: string[] = ["gray", "red", "orange", "yellow", "green", "teal", "bule", "indigo", "purple", "pink"]
    const opacities: number[] = [300, 400, 500, 600]
    const randomColor: string = colors[Math.floor(Math.random() * colors.length)]
    const randomOpacity: number = opacities[Math.floor(Math.random() * opacities.length)]
    return `bg-${randomColor}-${randomOpacity}`
}

interface NamedPerson {
    firstName: string
    lastName: string
}

export const getInitials = (student: NamedPerson): string => {
    return (student.firstName.substring(0, 1) + student.lastName.substring(0, 1)).toUpperCase()
}

const SEPTEMBER_MONTH = 8
export const getCurrentSchoolYear = (): number => {
    const currentDate = new Date()
    return currentDate.getMonth() >= SEPTEMBER_MONTH ?
        currentDate.getFullYear() :
        currentDate.getFullYear() - 1
}

export const getEducationYear = (graduationYear: number): string => {
    const educationsYear = ["Diplomé", "A3", "A2", "A1", "SUP", "SUP"]

    const date = new Date()
    // If we are only at the beginning of the year (before July, 8th) we still are in previous school's year
    const schoolYear = date.getMonth() < 8 ? date.getFullYear() - 1 : date.getFullYear()

    return educationsYear[Math.min(Math.max(0, graduationYear - schoolYear), educationsYear.length - 1)]
}

export const useQuery = (): URLSearchParams => new URLSearchParams(useLocation().search)


export const isFileImage = (file: string): boolean => ["image/gif", "image/jpeg", "image/png"].includes(file)

export const mediaPath = (fullPath?: string, size?: string): string | undefined => {
    if (fullPath) {
        const storageUrl = process.env.STORAGE_URL || "https://iseplife-dev.s3.eu-west-3.amazonaws.com"
        if (size) {
            const [_, path, filename, __] = fullPath.split(/(.*)\/(.*)/)
            fullPath = `${path}/${size}/${filename}`
        }

        return `${storageUrl}/${fullPath}`
    }
    return fullPath
}

export const getPhotosAsync = async (images: ImageType[]): Promise<PostPhoto[]> => {
    return await Promise.all(
        images.map(
            (img) => parsePhoto(img.name, String(img.id), img.nsfw)
        )
    )
}
export type PostPhoto = PhotoProps<{ hdSrc: string, nsfw: boolean, selected: boolean }>

export const parsePhoto = (imgUrl: string, key: string, nsfw: boolean): Promise<PostPhoto> => {
    return new Promise((resolve, reject) => {
        const image = new Image()
        image.src = mediaPath(imgUrl, GallerySizes.PREVIEW)!
        image.onerror = reject
        image.onload = () => resolve({
            nsfw,
            selected: false,
            src: image.src,
            width: image.width,
            height: image.height,
            key,
            srcSet: imgUrl,
            hdSrc: mediaPath(imgUrl, GallerySizes.LIGHTBOX)!
        })
    })
}


export class EntitySet<T extends Entity> {
    private items: Map<number, T>

    constructor() {
        this.items = new Map()
    }

    contains(entity: Entity): boolean {
        return this.items.has(entity.id)
    }

    add(entity: T): EntitySet<T> {
        if (!this.contains(entity))
            this.items.set(entity.id, entity)
        return this
    }

    addAll(entities: T[]): EntitySet<T> {
        entities.forEach(e => this.add(e))
        return this
    }

    remove(entity: T): EntitySet<T> {
        this.items.delete(entity.id)
        return this
    }

    clear(): EntitySet<T> {
        this.items = new Map()
        return this
    }

    isEmpty(): boolean {
        return this.count() === 0
    }

    count(): number {
        return this.items.size
    }

    filter(callbackFn: (val: T) => boolean): T[] {
        const filteredEntities: T[] = []
        this.items.forEach((entity) => {
            if (callbackFn(entity))
                filteredEntities.push(entity)
        })
        return filteredEntities
    }
}
