/// <reference lib="WebWorker" />

import { onBackgroundMessage, getMessaging } from "firebase/messaging/sw"
import { firebaseApp } from "./data/firebase"

declare const self: ServiceWorkerGlobalScope & typeof globalThis

const firebaseMessaging = getMessaging(firebaseApp)

onBackgroundMessage(firebaseMessaging, (payload) => {
    console.debug("Received background message ", payload)
})

console.debug("load firebase")
self.addEventListener("notificationclick", function(event) {
    console.debug("click", event)
})

export const initPushWorker = () => {
    
    self.addEventListener("push", async function (event) {
        console.debug("push", event)
    })
    // self.addEventListener("push", async function (event) {
    //     if (!event.data)
    //         return
        
    //     const json = JSON.parse(event.data.text())
    //     console.log("[Service Worker] Push received:", json)

    //     switch (json.type) {
    //         case "register":
    //             fetch(`${apiURI}/webpush/register/validate`, {
    //                 method: "POST",
    //                 headers: {
    //                     "Content-Type": "application/json"
    //                 },
    //                 body: JSON.stringify({
    //                     key: json.key,
    //                 })
    //             })
    //             break
    //         case "notification":
    //             event.waitUntil(self.registration.showNotification("IsepLife", {
    //                 body: json.text,
    //                 icon: mediaPath(json.icon, AvatarSizes.THUMBNAIL),
    //                 silent: false,
    //                 data: {
    //                     url: `/${json.link}`
    //                 }
    //             }))
    //             break
    //         default:
    //             break
    //     }
    // })
    
    self.addEventListener("notificationclick", function(event) {
        event.notification.close()
        event.waitUntil(
            self.clients.openWindow(event.notification.data.url)
        )

        console.debug("[Service Worker] Clicked, opening", event.notification.data.url)
    })
}
self.addEventListener("notificationclick", function(event) {
    console.debug("click2", event)
})
