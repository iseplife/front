import { Avatar, AvatarProps } from "antd"
import React, { ImgHTMLAttributes, useEffect, useState } from "react"
import { WebpMachine } from "webp-hero"

const machine = new WebpMachine()

export let isWebPSupported = true;
(machine as any).webpSupport.then((support: boolean) => isWebPSupported = support)

const loadedCache: { [key: string]: string } = {}
const loadingCache: { [key: string]: Promise<string> } = {}
let promiseToWait: Promise<string> | undefined

const canvas = document.createElement("canvas")

export const polyfillWebp = async (propsSrc: string, forceProcess?: boolean) => {
    if ((!propsSrc.endsWith(".webp") || isWebPSupported) && !forceProcess)
        return propsSrc
    
    propsSrc = `${propsSrc}?polyfill=1`
    
    if (propsSrc in loadingCache) {
        return loadingCache[propsSrc]
    }
    if (loadedCache[propsSrc])
        return loadedCache[propsSrc]

    return await (loadingCache[propsSrc] = (async () => {
        const data = await (await fetch(propsSrc)).arrayBuffer()

        const oldWait = promiseToWait
        
        return await (promiseToWait = (async () => {
            if (oldWait)
                await oldWait
            try {
                for (let i = 3; i--;)
                    try {
                        await machine.decodeToCanvas(canvas, new Uint8Array(data))
                        const url = canvas.toDataURL("image/jpeg")
                        let blob = await (await fetch(url)).blob()
                        setTimeout(() => {
                            delete loadedCache[propsSrc]
                        }, 1000 * (blob.size < 150000 ? 60 * 7 : blob.size < 500000 ? 60 * 3 : 10))

                        blob = undefined!//opti

                        if(!forceProcess)
                            loadedCache[propsSrc] = url
                        return url
                    } catch (e) {
                        console.log("Error when converting webp", e)
                        await new Promise(resolve => setTimeout(resolve, 100))
                    }
            } finally {
                delete loadingCache[propsSrc]
            }
            throw new Error(`Failed to polyfill webp (${propsSrc})`)
        })())
    })())
}

const WebPPolyfill: React.FC<ImgHTMLAttributes<HTMLImageElement>> = (props) => {
    const propsSrc = props.src!
    const [src, setSrc] = useState(isWebPSupported ? props.src : loadedCache[propsSrc] ?? "")
    useEffect(() => {
        if (!isWebPSupported)
            polyfillWebp(propsSrc).then(setSrc)
    }, [propsSrc])
    return <>
        {src && <img {...props} src={src} />}
    </>
}

export const WebPAvatarPolyfill: React.FC<AvatarProps & React.RefAttributes<HTMLElement>> = (props) => {
    const propsSrc = props.src as string
    const [src, setSrc] = useState(isWebPSupported ? props.src : loadedCache[propsSrc])
    useEffect(() => {
        if (!isWebPSupported && propsSrc?.length)
            polyfillWebp(propsSrc).then(setSrc)
    }, [propsSrc])
    return <>
        {<Avatar {...props} src={src} />}
    </>
}

export default WebPPolyfill