import {Geolocation} from "@capacitor/geolocation"
import {DeviceOrientation, DeviceOrientationCompassHeading} from "@awesome-cordova-plugins/device-orientation"
import React, { useCallback, useEffect, useMemo, useState } from "react"
import { generatePositionUtil } from "../../../../data/wei/rooms/map/utils"
import { isWeb } from "../../../../data/app"
import { isPlatform } from "@ionic/core"
import ErrorInterface from "../../../errors/ErrorInterface"
import { useTranslation } from "react-i18next"
import LoadingPage from "../../../LoadingPage"
import { WeiMapEntity, WeiMapFriend } from "../../../../data/wei/rooms/map/types"
import { getFriendsLocation, getMapBackground, getMapEntities } from "../../../../data/wei/rooms/map"
import { useIonAlert } from "@ionic/react"
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch"
import { WebPAvatarPolyfill } from "../../../../components/Common/WebPPolyfill"
import { mediaPath } from "../../../../util"
import { AvatarSizes } from "../../../../constants/MediaSizes"
import { differenceInHours, differenceInMinutes, isPast } from "date-fns"
import { isFuture } from "date-fns/esm"
import { setWeiBackgroundGeoPerm, setWeiBackgroundSendPerm, weiLastLoc } from "../WeiMapBackground"

const bgSize = {w: 2425, h: 3491}
let i = -1
const WeiMapPage: React.FC = () => {
    const [geoPos, setGeoPos] = useState<[number, number, number]>(weiLastLoc)
    const [pos, setPos] = useState<{x: number, y: number}>({x:0,y:0})
    const [heading, setHeading] = useState<DeviceOrientationCompassHeading>()
    const [permission, setPermission] = useState<boolean>()

    const [presentAlert] = useIonAlert()

    const size = useMemo(() => ({
        w: window.innerWidth, h: 3491/2425*window.innerWidth
    }), [])

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

        setWeiBackgroundGeoPerm(true)
        
        const deviceorientation = isWeb || isPlatform("android")

        const unWatchOnChange: (() => void)[] = []
        
        console.log("start watching")
        // const geoWatchId = Geolocation.watchPosition({ enableHighAccuracy: true }, pos => {
        //     console.log("got position", pos)
        //     if(pos){
        //         setGeoPos([pos.coords.latitude, pos.coords.longitude, pos.coords.accuracy])
        //         console.debug(pos.coords)
        //     }
        // })
        // unWatchOnChange.push(async () => Geolocation.clearWatch({id: await geoWatchId}))

        if(deviceorientation){
            const fnc = (event: DeviceOrientationEvent) => {
                setHeading({
                    headingAccuracy: 0,
                    magneticHeading: -event.alpha!,
                    trueHeading: -event.alpha!,
                    timestamp: 0,
                })
            }
            window.addEventListener("deviceorientation", fnc)
            unWatchOnChange.push(() => window.removeEventListener("deviceorientation", fnc))
        }
        else {
            const sub = DeviceOrientation.watchHeading({frequency: 50}).subscribe(heading => {
                setHeading(heading)
            })
            unWatchOnChange.push(() => sub.unsubscribe())
        }
        return () => unWatchOnChange.forEach(fnc => fnc())
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
        console.debug(locationConverter(geoPos[0], geoPos[1]))
    }, [geoPos])
    const {screenXYLatLong, latlngToScreenXY: locationConverter} = generatePositionUtil({
        lat: 45.11153094038729,
        lng: 1.9584357288968062,
        scrX: 401/bgSize.w*size.w,
        scrY: 969/bgSize.h*size.h,
    },{
        lat: 45.1095294470397,
        lng: 1.9617392641228724,
        scrX: 1427/bgSize.w*size.w,
        scrY: 1841/bgSize.h*size.h,
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

    const snapMap = localStorage.getItem("showSnapMap2024") == "true"
    const [sendPermission, setSendPermission] = useState(localStorage.getItem("snapmap2024permission"))
    const [friendPositions, setFriendPositions] = useState<(WeiMapFriend & {x: number, y: number})[]>([])

    useEffect(() => {
        const id = setInterval(() => {
            setGeoPos(weiLastLoc)
        }, 1000)
        return () => clearInterval(id)
    }, [])
    useEffect(() => {
        setWeiBackgroundSendPerm(sendPermission == "true")
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
                            localStorage.setItem("snapmap2024permission", "false")
                            return false
                        },
                    },
                    {
                        text: "Activer",
                        role: "confirm",
                        handler: () => {
                            setSendPermission("true")
                            localStorage.setItem("snapmap2024permission", "true")
                        },
                    },
                ],
            })
        }
    }, [snapMap, sendPermission])

    const toggleWeiMap = useCallback(() => {
        setSendPermission(perm => {
            const newPerm = perm == "false" ? "true" : "false"
            localStorage.setItem("snapmap2024permission", newPerm)
            return newPerm
        })
    }, [])

    useEffect(() => {
        if(sendPermission == "false")
            setFriendPositions([])
    }, [sendPermission])

    const [background, setBackground] = useState<{color: string, assetUrl: string}>({
        "color": "#c9c7f0"/*"#99B68C"*/,
        "assetUrl": "/img/wei/map/bg2024.svg",
    })

    useEffect(() => {
        // getMapBackground().then(res => setBackground(res.data))
    }, [])

    const click = useCallback((e: React.MouseEvent) => {
        const bounds = (e.target as HTMLElement).getBoundingClientRect()
        const x = e.clientX - bounds.left
        const y = e.clientY - bounds.top
        const pos = screenXYLatLong(x, y)
        const list = [185, 186, 187, 188, 189, 190, 192, 193, 215, 216, 217, 218, 219, 220, 221, 222, 223, 224, 226, 227, 228, 230, 231, 232, 233, 234, 235, 261, 262, 263, 264, 265, 266, 267, 268, 269, 270, 271, 273, 274, 275, 276, 277]
        console.log(`map.put(${list[i++]}, ${pos.lat}/${pos.lng});`)
    }, [])

    return permission === null ? <LoadingPage /> : !permission ? <ErrorInterface error={t("map.no_perm")} /> : <div className="w-full h-full max-h-full max-w-full relative">
        <div onClick={toggleWeiMap} className="bg-white/50 backdrop-blur shadow-lg shadow-black/[5%] px-4 py-2 absolute top-3 left-1/2 -translate-x-1/2 z-50 rounded-full font-medium cursor-pointer text-center w-[80%] sm:w-auto max-w-[80%] text-[15px]">
            WeiMap {sendPermission == "true" ? "activée" : "desactivée"}
            <div className="text-[10px] leading-3 text-neutral-500">{sendPermission == "false" ? "Cliquez ici pour l'activer. Vous pourrez la desactiver à votre guise" : "Votre position est partagée avec les gens que vous suivez"}</div>
        </div>
        <TransformWrapper limitToBounds minScale={1} initialScale={1} minPositionY={0} minPositionX={0}>
            <TransformComponent wrapperClass="w-full h-full relative" wrapperStyle={{background: background?.color}}>
                <div style={{width: window.innerWidth, height: size.h/size.w*window.innerWidth}} className="relative" onClick={click} >
                    <img src={background?.assetUrl} alt="Background" className="h-full w-full" draggable={false} />
                    {/* <img src="/img/wei/map/mapV2.svg" alt="Background" className="absolute opacity-50" style={{top: 30, left: 40, width: 365 * sizee, height: 526 * sizee}}  /> */}

                    {
                        entities.map(entity => entity.disappearDate && isPast(entity.disappearDate) ? <></> : <div 
                            className="absolute drop-shadow-lg transform -translate-x-1/2 -translate-y-1/2 cursor-pointer" onClick={() => openPopup(entity)} style={{left: entity.x, top: entity.y, width: entity.size, height: entity.size}}
                        >
                            <img src={entity.assetUrl} alt="Image" className="w-full h-full"/>
                            {entity.disappearDate && Math.abs(differenceInMinutes(new Date(), entity.disappearDate)) < 60 && isFuture(entity.disappearDate) && <div className="px-1 py-[1px] mt-1 rounded-md shadow-sm bg-white text-[10px] absolute left-1/2 -translate-x-1/2 -bottom-0.5 translate-y-full font-medium text-red-900">{differenceInMinutes(entity.disappearDate, new Date())+"mn"}</div>}
                        </div>)
                    }

                    {headingImage && <img src={headingImage} style={{transform: !heading ? "" : `rotateZ(${heading.trueHeading}deg)`, top: pos.y, left: pos.x}} alt="heading" className="absolute w-14 h-14 -ml-7 -mt-7 opacity-30" />}
                    <div className="bg-indigo-400 border-white border-2 shadow-md shadow-indigo-600/40 w-4 h-4 -mt-2 -ml-2 rounded-full absolute scale-75" style={{top: pos.y, left: pos.x}}></div>

                    {
                        friendPositions.map(friend => {
                            return <div className="absolute flex justify-center flex-col transform -translate-x-1/2 -translate-y-1/2 scale-[60%]" style={{left: friend.x, top: friend.y}}>
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