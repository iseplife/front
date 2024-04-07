import {useLocation} from "react-router-dom"
import {Entity} from "./data/request.type"
import {format, formatDistance} from "date-fns"
import {enUS, fr} from "date-fns/locale"
import {Image as ImageType, MediaStatus} from "./data/media/types"
import {PhotoProps} from "react-photo-gallery"
import {GallerySizes} from "./constants/MediaSizes"
import {t, TFunction} from "i18next"
import axios from "axios"
import {EventPosition, Marker} from "./data/event/types"
import { CSSProperties, MouseEvent, useCallback, useLayoutEffect, useRef } from "react"
import { Post } from "./data/post/types"
import { appUrl } from "./data/http"
import { isAndroidApp, isIosApp, isWeb } from "./data/app"
import { Filesystem, Directory } from "@capacitor/filesystem"
import { Media } from "@capacitor-community/media"
import { Toast } from "@capacitor/toast"
import { message } from "antd"


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
            return [t("post:just_now"), (60 * 1.5 - diff) * 1_000]
        else if (diff / 60 < 60)// Less than 1 hour ago
            return [`${Math.floor(diff / 60)} min`, (60 - diff % 60) * 1_000]
        else
            return [`${Math.floor(diff / 60 / 60)} h`, (60*60 - diff % (60*60)) * 1_000]
    } else if (nowDay == dateDay + 1)//Yesterday
        return [`${t("yesterday")} ${format(date, "HH:mm")}`, (60 * 60 * 24 - dateS % (60 * 60 * 24)) * 1_000]
    else if (now.getFullYear() == date.getFullYear())//This year
        return [_format(date, "d LLL, HH:mm"), -1]
    else
        return [_format(date, "d LLL yyyy, HH:mm"), -1]
}

export const formatDateWithTimer = (date: Date, t: TFunction, setFormattedDate: (date: string) => void, doFirst = true) => {
    let timeoutId: number
    const updateDate = (first = false) => {
        const [formattedDate, wait] = formatDate(date, t)
        if(doFirst || !first)
            setFormattedDate(formattedDate)
        if (wait > 0)
            timeoutId = window.setTimeout(() => updateDate(), wait)
    }
    updateDate(true)
    return () => window.clearTimeout(timeoutId)
}


export const _formatDistance = (date: Date | number, baseDate: Date | number, options?: {
    includeSeconds?: boolean
    addSuffix?: boolean
    locale?: Locale
}): string => formatDistance(date, baseDate, {
    locale: locales[localStorage.getItem("lng") || "fr"],
    ...options
})


export const isLocalhost = Boolean(
    window.location.hostname === "localhost" ||
    // [::1] is the IPv6 localhost address.
    window.location.hostname === "[::1]" ||
    // 127.0.0.0/8 are considered localhost for IPv4.
    window.location.hostname.match(
        /^127(?:\.(?:25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)){3}$/
    )
)

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

function mediaPath(fullPath: string, size?: string): string
function mediaPath(fullPath: string | undefined, size?: string): string | undefined
function mediaPath(fullPath: string | undefined, size?: string): string | undefined {
    if (fullPath) {
        const storageUrl = process.env.REACT_APP_STORAGE_URL || "https://storage.iseplife.fr"
        if (size) {
            const [_, path, filename, __] = fullPath.split(/(.*)\/(.*)/)
            fullPath = `${path}/${size}/${filename}`
        }

        return `${storageUrl}/${fullPath}`
    }
    return fullPath
}

export {mediaPath}

export type SafePhoto = PhotoProps<{nsfw: boolean, color: string, status: MediaStatus, id: number, ratio: number}>
export type SelectablePhoto = SafePhoto & {selected: boolean}

export type ParserFunction<T extends PhotoProps = SafePhoto> = (img: ImageType, key: string, quality?: string) => T
export const parsePhotosAsync= async <T extends PhotoProps = SafePhoto>(images: ImageType[], parser?: ParserFunction<T>, quality?: string): Promise<T[]> => {
    return images.map(img => (parser ?? defaultPhotoParser)(img, String(img.id), quality)) as T[]
}
export const parsePhotosSync= (images: ImageType[], parser?: ParserFunction, quality?: string): SafePhoto[] => 
    images.map(img => (parser ?? defaultPhotoParser)(img, String(img.id), quality))

export const defaultPhotoParser: ParserFunction = (img: ImageType, key: string, quality?: string): SafePhoto => {
    return {
        key,
        id: img.id,
        width: img.ratio * 100,
        height: 100,
        color: img.color,
        src: mediaPath(img.name, quality ?? GallerySizes.PREVIEW) as string,
        ratio: img.ratio,
        status: img.status,
        nsfw: img.nsfw,
        srcSet: img.name,
    }
}


export const positionToMarker = (position?: EventPosition) => {
    let marker: Marker | undefined = undefined
    if (position) {
        const strArr = position.coordinates.split(";")
        marker = [+strArr[0], +strArr[1]]
    }
    return marker
}

export const setStyles = (element: HTMLElement, style: CSSProperties, important = true) => {
    for(const entry of Object.entries(style)){
        (element.style as any)[entry[0]] = entry[1]
        if(important)
            element.style.setProperty(
                entry[0]
                    .split("")
                    .map(letter => letter == letter.toUpperCase() ? `-${letter}` : letter)
                    .join(""),
                entry[1],
                "important"
            )
    }
}

export const waitForFrame = async () => new Promise(requestAnimationFrame)

export const getPostLink = (post: Post, withHost = true) => 
    [...(withHost ? [appUrl.origin] : []), post.context.type.toLowerCase(), post.context.id, "post", post.id.toString()].join("/")

export const copyToClipboard = (str: string) => {
    const el = document.createElement("textarea")
    el.value = str
    el.setAttribute("readonly", "")
    el.style.position = "absolute"
    el.style.left = "-9999px"
    document.body.appendChild(el)
    el.select()
    document.execCommand("copy")
    document.body.removeChild(el)
}

export const arrayEquals = (array: unknown[], array1: unknown[]) => 
    Array.isArray(array) && Array.isArray(array1)
    && array.length == array1.length
    && array.every((element, index) => array1[index] == element)
export const releaseCanvas = (canvas: HTMLCanvasElement) => {
    canvas.width = canvas.height = 1
    canvas.getContext("2d")?.clearRect(0, 0, 1, 1)
}
export const limitSize = (size: {width: number, height: number}, maximumPixels = 16777216) => {
    const { width, height } = size

    const requiredPixels = width * height
    if (requiredPixels <= maximumPixels) return { width, height }

    const scalar = Math.sqrt(maximumPixels) / Math.sqrt(requiredPixels)
    return {
        width: Math.floor(width * scalar),
        height: Math.floor(height * scalar),
    }
}
export const downloadFile = async (url: string, name: string, savedMessage: string) => {
    if(isWeb){
        const a = document.createElement("a")
        a.download = name
        a.href = url
        a.click()
    } else {
        try {
            const albumName = "IsepLife"

            while(name.indexOf("/") !== -1)
                name = name.replace("/", "-")

            const wallpaperTemp = await Filesystem.writeFile({
                path: name,
                data: url,
                directory: Directory.Cache,
            })
            let albums = await Media.getAlbums()
            let album = albums.albums.find(a => a.name === albumName)
            if (!album) {
                if(isIosApp) {
                    // Doesn't exist, create new album
                    await Media.createAlbum({ name: albumName })
                    albums = await Media.getAlbums()
                    album = albums.albums.find(a => a.name === albumName)
                } else if(isAndroidApp)
                    await Media.createAlbum({ name: albumName }).catch(e => console.debug(e))
            }
            
            await Media.savePhoto({
                path: wallpaperTemp.uri,
                album: album?.identifier ?? albumName
            }).then(() => console.debug("Image has been saved")).catch(console.error)
    
            Toast.show({
                text: savedMessage,
                position: "bottom",
                duration: "short",
            })
        }catch(e){
            console.error(e)
            message.info(t("common:update").toString())
        }
    }
    
}

export const TailwindUtils = {
    isMd: () => window.innerWidth >= 768
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

    *[Symbol.iterator]() {
        for (const item of this.items)
            yield item
    }

    forEach(callbackFn: (val: T) => void): void {
        this.items.forEach(callbackFn)
    }

    map<K>(callbackFn: (val: T) => K): K[] {
        const mappedEntities: K[] = []
        this.items.forEach((entity) => {
            mappedEntities.push(callbackFn(entity))
        })
        return mappedEntities
    }

    toArray() {
        return Array.from(this.items.values())
    }
}


interface Options {
    isPreventDefault?: boolean
    delay?: number
}

const isTouchEvent = (ev: TouchEvent | MouseEvent): ev is TouchEvent => {
    return "touches" in ev
}

const useLongPress = (
    callback: (e: TouchEvent | MouseEvent) => void,
    click: () => void,
    { isPreventDefault = true, delay = 300 }: Options = {}
) => {
    const timeout = useRef<ReturnType<typeof setTimeout>>()
    const ref = useRef<HTMLElement>()
    const timeoutStart = useRef<number>()

    const startPosition = useRef({ x: 0, y: 0 })

    const start = useCallback(
        (event: TouchEvent | MouseEvent) => {
            console.log("start")
            // prevent ghost click on mobile devices
            if(isTouchEvent(event))
                startPosition.current = {
                    x: event.touches[0].clientX,
                    y: event.touches[0].clientY,
                }
            else
                startPosition.current = { x: 0, y: 0 }

            event.preventDefault()
            timeoutStart.current = Date.now()
            timeout.current = setTimeout(() => callback(event), delay)
        },
        [callback, delay]
    )

    const clear = useCallback((move?: boolean) => {
        // clearTimeout and removeEventListener
        timeout.current && clearTimeout(timeout.current)
        if(!move && (timeoutStart.current ?? 0) + 250 > Date.now())
            click()
    }, [click])
    const clearHandler = useCallback(() => clear(), [clear])

    const touchMove = useCallback((event: React.TouchEvent) => {
        if (
            startPosition.current.x &&
            (Math.abs(event.touches[0].clientX - startPosition.current.x) > 10 ||
            Math.abs(event.touches[0].clientY - startPosition.current.y) > 10)
        ){
            clear(true)
            timeoutStart.current = 0
        }
    }, [clear])

    return {
        onTouchEnd: clearHandler,
        onTouchMove: touchMove,
        ref: (element: HTMLElement) => {
            ref.current = element
            element?.removeEventListener("touchstart", start)
            element?.addEventListener("touchstart", start, { passive: false })
        }
    } as const
}
  
export {useLongPress}