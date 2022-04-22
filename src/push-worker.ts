/// <reference lib="WebWorker" />

declare const self: ServiceWorkerGlobalScope & typeof globalThis

export const initPushWorker = () => {
    self.addEventListener("push", async function (event) {
        if (!event.data)
            return
        console.log("[Service Worker] Push Received.")
        const text = event.data.text()
        console.log(`[Service Worker] Push had this data: "${text}"`)

        const json = JSON.parse(text)

        const title = "IsepLife"
        const options = {
            body: "Yay ça marche !",
            icon: "ISEPLive.jpg",
            silent: true
        }

        event.waitUntil(self.registration.showNotification(title, options))
        console.log(json)

        if (json.type == "register") {
            fetch("http://localhost:8080/webpush/register/validate", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    key: json.key,
                })
            })
        }
    })
}