import {Geolocation} from "@capacitor/geolocation"
import {DeviceOrientation, DeviceOrientationCompassHeading} from "@awesome-cordova-plugins/device-orientation"
import { useCallback, useEffect, useMemo, useState } from "react"
import { generatePositionUtil } from "../../../../data/wei/rooms/map/utils"
import { isWeb } from "../../../../data/app"
import { isPlatform } from "@ionic/core"
import ErrorInterface from "../../../errors/ErrorInterface"
import { useTranslation } from "react-i18next"
import LoadingPage from "../../../LoadingPage"
import { WeiMapEntity, WeiMapFriend } from "../../../../data/wei/rooms/map/types"
import { getFriendsLocation, getMapBackground, getMapEntities, sendLocation } from "../../../../data/wei/rooms/map"
import { useIonAlert } from "@ionic/react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { WebPAvatarPolyfill } from "../../../../components/Common/WebPPolyfill"
import { mediaPath } from "../../../../util"
import { AvatarSizes } from "../../../../constants/MediaSizes"
import { differenceInHours, differenceInMinutes, isPast } from "date-fns"
import { isFuture } from "date-fns/esm"

const size = {w: 730, h: 786}

const WeiMapPage: React.FC = () => {
    const [geoPos, setGeoPos] = useState<[number, number, number]>([0, 0, 0])
    const [pos, setPos] = useState<{x: number, y: number}>({x:0,y:0})
    const [heading, setHeading] = useState<DeviceOrientationCompassHeading>()
    const [permission, setPermission] = useState<boolean>()

    const [presentAlert] = useIonAlert()

    useEffect(() => {
        Geolocation.checkPermissions().then(perm => {
            if(perm.location != "granted"){
                (isWeb ? Geolocation.getCurrentPosition({enableHighAccuracy: true}) : Geolocation.requestPermissions({
                    permissions: ["location"]
                })).then(granted => {
                    Geolocation.checkPermissions().then(granted => {
                        setPermission(granted.location == "granted")
                    })
                })
            }else
                setPermission(true)
        })
    }, [])
    useEffect(() => {
        if(!permission)
            return
        
        const deviceorientation = isWeb || isPlatform("android")
        
        Geolocation.watchPosition({ enableHighAccuracy: true }, pos => {
            if(pos){
                setGeoPos([pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy])
                console.debug(pos.coords)
            }
        })

        if(deviceorientation){
            window.addEventListener("deviceorientation", event => {
                setHeading({
                    headingAccuracy: 0,
                    magneticHeading: -event.alpha!,
                    trueHeading: -event.alpha!,
                    timestamp: 0,
                })
            })
        }
        else
            DeviceOrientation.watchHeading({frequency: 50}).subscribe(heading => {
                setHeading(heading)
            })
    }, [permission])

    const [headingImage, setHeadingImage] = useState<string>()

    useEffect(() => {
        if(!heading)
            return
        const canvas = document.createElement("canvas")
        canvas.width = 500
        canvas.height = 500

        const ctx = canvas.getContext("2d")!
        const cw = canvas.width
        const ch = canvas.height
        const strokewidth = cw/2
        const cx = cw/2
        const cy = ch/2
        const radius = Math.min(cw,ch)/2-strokewidth/2

        const approx = Math.max(80, heading.headingAccuracy) * Math.PI / 180

        ctx.lineWidth = strokewidth
        ctx.lineCap = "butt"
        ctx.beginPath()
        ctx.arc(cx,cy,radius, -Math.PI/2-approx/2, -Math.PI/2 + approx / 2)
        ctx.strokeStyle = "rgb(129, 140, 248)"
        ctx.stroke()

        setHeadingImage(canvas.toDataURL())
    }, [heading?.headingAccuracy])

    useEffect(() => {
        setPos(locationConverter(geoPos[0], geoPos[1]))
    }, [geoPos])
    const locationConverter = generatePositionUtil({
        lat: 49.322642,
        lng: -1.111938,
        scrX: 0,
        scrY: 0,
    },{
        lat: 49.318026,
        lng: -1.105361,
        scrX: size.w,
        scrY: size.h,
    })

    const {t} = useTranslation("wei")

    const [entities, setEntities] = useState<(WeiMapEntity & {x: number, y: number})[]>([])

    useEffect(() => {
        let id = 0
        const fnc = async () => {
            try{
                const entities = await getMapEntities()
                setEntities(entities.data.map(entity => ({...entity, ...locationConverter(entity.lat, entity.lng)})))
            } catch(e) {
                console.error(e)
            }
            if(id != -1)
                setTimeout(fnc, 1000 * 60 * 4)
        }
        fnc()
        return () => {
            clearTimeout(id)
            id = -1
        }
    }, [])

    useEffect(() => {
        const interval = setInterval(() => setEntities(ent => [...ent]), 30000)
        return () => clearInterval(interval)
    }, [])

    const openPopup = useCallback((entity: WeiMapEntity) => {
        presentAlert({
            header: entity.name,
            message: entity.description,
            buttons: [
                {
                    text: "Ok",
                    role: "confirm",
                },
            ],
        })
    }, [])

    const snapMap = localStorage.getItem("showSnapMap2022") == "true"
    const [sendPermission, setSendPermission] = useState(localStorage.getItem("snapmap2022permission"))

    const debouncedUpdateServerPos = useMemo(() => {
        let lastTime = 0
        let timingWaiting = 0
        return (pos: [number, number, number]) => {
            clearTimeout(timingWaiting)
            const now = Date.now()
            if(now - lastTime > 30000 ){
                lastTime = now
                console.debug("send pos")
                sendLocation(pos[0], pos[1])
            } else {
                timingWaiting = window.setTimeout(() => {
                    lastTime = Date.now()
                    console.debug("send pos")
                    sendLocation(pos[0], pos[1])
                }, lastTime + 30_000 - now)
            }
            sendLocation(pos[0], pos[1])
        }
    }, [])

    const [friendPositions, setFriendPositions] = useState<(WeiMapFriend & {x: number, y: number})[]>([])

    useEffect(() => {
        if(geoPos[0]/* && geoPos[2] < 50*/ && sendPermission == "true"){
            console.debug("init send")
            debouncedUpdateServerPos(geoPos)
        }
    }, [geoPos, sendPermission])

    useEffect(() => {
        if(sendPermission != "true")
            return
        let id = 0
        const fnc = () => {
            if(id != -1)
                getFriendsLocation().then(res => setFriendPositions(res.data.map(friend => ({...friend, ...locationConverter(friend.lat, friend.lng)})))).finally(() => id != -1 && setTimeout(fnc, 10_000))
        }
        fnc()
        return () => {
            clearTimeout(id)
            id = -1
        }
    }, [sendPermission])

    useEffect(() => {
        if(snapMap && sendPermission === null){
            presentAlert({
                header: "La WeiMap !",
                message: "En activant cette fonctionnalité, vous pourrez voir la position des amis qui vous suivent, et ceux que vous suivez verront la vôtre !",
                buttons: [
                    {
                        text: "Désactiver",
                        role: "cancel",
                        handler: () => {
                            setSendPermission("false")
                            localStorage.setItem("snapmap2022permission", "false")
                            return false
                        },
                    },
                    {
                        text: "Activer",
                        role: "confirm",
                        handler: () => {
                            setSendPermission("true")
                            localStorage.setItem("snapmap2022permission", "true")
                        },
                    },
                ],
            })
        }
    }, [snapMap, sendPermission])

    const toggleWeiMap = useCallback(() => {
        setSendPermission(perm => {
            const newPerm = perm == "false" ? "true" : "false"
            localStorage.setItem("snapmap2022permission", newPerm)
            return newPerm
        })
    }, [])

    useEffect(() => {
        if(sendPermission == "false")
            setFriendPositions([])
    }, [sendPermission])

    const [background, setBackground] = useState<{color: string, assetUrl: string}>()

    useEffect(() => {
        getMapBackground().then(res => setBackground(res.data))
    }, [])

    return permission === null ? <LoadingPage /> : !permission ? <ErrorInterface error={t("map.no_perm")} /> : <div className="w-full h-full max-h-full max-w-full relative">
        <div onClick={toggleWeiMap} className="bg-white/50 backdrop-blur shadow-lg shadow-black/[5%] px-4 py-2 absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-full font-medium cursor-pointer text-center w-[80%] sm:w-auto max-w-[80%] text-[15px]">
            WeiMap {sendPermission == "true" ? "activée" : "desactivée"}
            <div className="text-[10px] leading-3 text-neutral-500">{sendPermission == "false" ? "Cliquez ici pour l'activer. Vous pourrez la desactiver à votre guise" : "Votre position est partagée avec les gens que vous suivez"}</div>
        </div>
        <TransformWrapper>
            <TransformComponent wrapperClass="w-full h-full relative" wrapperStyle={{background: background?.color}}>
                <div style={{width: size.w, height: size.h}} className="relative" >
                    <img src={background?.assetUrl} alt="Background" draggable={false} />
                    {/* <img src="/img/wei/map/mapV2.svg" alt="Background" className="absolute opacity-50" style={{top: 30, left: 40, width: 365 * sizee, height: 526 * sizee}}  /> */}

                    {
                        entities.map(entity => entity.disappearDate && isPast(entity.disappearDate) ? <></> : <div 
                            className="absolute drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => openPopup(entity)} style={{left: entity.x, top: entity.y, width: entity.size, height: entity.size}}
                        >
                            <img src={entity.assetUrl} alt="Image" className="w-full h-full"/>
                            {entity.disappearDate && Math.abs(differenceInMinutes(new Date(), entity.disappearDate)) < 60 && isFuture(entity.disappearDate) && <div className="px-1 py-[1px] mt-1 rounded-md shadow-sm bg-white text-[10px] absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full font-medium text-red-900">{differenceInMinutes(entity.disappearDate, new Date())+"m"}</div>}
                        </div>)
                    }

                    {headingImage && <img src={headingImage} style={{transform: !heading ? "" : `rotateZ(${heading.trueHeading}deg)`, top: pos.y, left: pos.x}} alt="heading" className="absolute w-14 h-14 -ml-7 -mt-7 opacity-30" />}
                    <div className="bg-indigo-400 border-white border-2 shadow-md shadow-indigo-600/40 w-4 h-4 -mt-2 -ml-2 rounded-full absolute" style={{top: pos.y, left: pos.x}}></div>

                    {
                        friendPositions.map(friend => {
                            return <div className="absolute flex justify-center flex-col transform -translate-x-1/2 -translate-y-1/2" style={{left: friend.x, top: friend.y}}>
                                <WebPAvatarPolyfill src={mediaPath(friend.student.picture, AvatarSizes.THUMBNAIL)} className="w-7 h-7 rounded-full border-2 border-white shadow-sm" />
                                <div className="px-1 py-[1px] mt-1 font-medium rounded-md shadow-sm bg-white text-black text-[10px] absolute left-1/2 -translate-x-1/2 -bottom-1 translate-y-full">{Math.abs(differenceInMinutes(new Date(), friend.timestamp)) > 60 ? differenceInHours(new Date(), friend.timestamp)+"h" : differenceInMinutes(new Date(), friend.timestamp)+"m"}</div>
                            </div>
                        })
                    }
                </div>
            </TransformComponent>
        </TransformWrapper>
    </div>
}

export default WeiMapPage