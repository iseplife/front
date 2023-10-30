import { precacheAndRoute } from "workbox-precaching"
import { registerRoute, Route } from "workbox-routing"
import { StaleWhileRevalidate, CacheOnly } from "workbox-strategies"
import { initPushWorker } from "./push-worker"
import { ExpirationPlugin } from "workbox-expiration"
import { BroadcastChannel } from "broadcast-channel"

declare const self: Window & typeof globalThis & ServiceWorkerGlobalScope
export {}

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
    maxEntries: number,
    maxAgeMins: number,
    excludePaths: string[] = []
): Route => registerRoute(
    ({ request }) => request.destination === destination && !excludePaths.find(path => request.url.includes(path)),
    new StaleWhileRevalidate({
        cacheName: cacheName,
        plugins: [
            new ExpirationPlugin({
                maxEntries,
                maxAgeSeconds: maxAgeMins * 60, 
            })
        ]
    })
)
const registerCacheOnlyRouteUsing = (
    destination: RequestDestination,
    cacheName: string,
    excludePaths: string[] = []
): Route => registerRoute(
    ({ request }) => request.destination === destination && !excludePaths.find(path => request.url.includes(path)),
    new CacheOnly({
        cacheName: cacheName,
    })
)

const CACHE_PREFIX = "iseplife-cache"
const CACHE_SCRIPT_NAME = `${CACHE_PREFIX}-scripts`
const CACHE_STYLES_NAME = `${CACHE_PREFIX}-styles`
const CACHE_DOCUMENTS_NAME = `${CACHE_PREFIX}-documents`
const CACHE_FONTS_NAME = `${CACHE_PREFIX}-fonts`
registerCacheFirstRouteUsing("style", CACHE_STYLES_NAME, 60, 7)
registerCacheOnlyRouteUsing("script", CACHE_SCRIPT_NAME)
registerCacheFirstRouteUsing("document", CACHE_DOCUMENTS_NAME, 5, 7)
registerCacheFirstRouteUsing("font", CACHE_FONTS_NAME, 10, 60 * 24 * 30)

initPushWorker()
