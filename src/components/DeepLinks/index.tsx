import React, { useEffect } from "react"
import { App, URLOpenListenerEvent } from "@capacitor/app"
import { useHistory } from "react-router-dom"

const DeepLinks: React.FC = () => {
    const history = useHistory()
    useEffect(() => {
        App.addListener("appUrlOpen", (event: URLOpenListenerEvent) => {
            const slug = event.url.split(".fr").pop()
            if (slug)
                history.push(slug)
        })
    }, [])
    return <></>
}

export default DeepLinks
