import { BroadcastChannel } from "broadcast-channel"
import { precacheAndRoute } from "workbox-precaching"
import { registerRoute, Route } from "workbox-routing"
import { CacheFirst } from "workbox-strategies"
import { initPushWorker } from "./push-worker"

declare const self: Window & typeof globalThis & ServiceWorkerGlobalScope
export { }

precacheAndRoute(self.__WB_MANIFEST)

self.skipWaiting()

const broadcastChannel = new BroadcastChannel("service-worker", { webWorkerSupport: true })

self.addEventListener("install", function () {
    console.debug("Installed Service Worker")
    broadcastChannel.postMessage("update")
    broadcastChannel.postMessage({type: "update", version: process.env.REACT_APP_COMMIT})
})

const registerCacheFirstRouteUsing = (
    destination: RequestDestination,
    cacheName: string,
    excludePaths: string[] = []
): Route => registerRoute(
    ({ request }) => request.destination === destination && !excludePaths.find(path => request.url.includes(path)),
    new CacheFirst({
        cacheName: cacheName,
    })
)

const CACHE_PREFIX = "iseplife-cache"
const CACHE_SCRIPT_NAME = `${CACHE_PREFIX}-scripts`
const CACHE_STYLES_NAME = `${CACHE_PREFIX}-styles`
const CACHE_DOCUMENTS_NAME = `${CACHE_PREFIX}-documents`
const CACHE_FONTS_NAME = `${CACHE_PREFIX}-fonts`
registerCacheFirstRouteUsing("style", CACHE_STYLES_NAME)
registerCacheFirstRouteUsing("script", CACHE_SCRIPT_NAME)
registerCacheFirstRouteUsing("document", CACHE_DOCUMENTS_NAME)
registerCacheFirstRouteUsing("font", CACHE_FONTS_NAME)

initPushWorker()
