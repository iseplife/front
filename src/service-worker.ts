import { precacheAndRoute } from "workbox-precaching"
import { registerRoute, Route } from "workbox-routing"
import { StaleWhileRevalidate } from "workbox-strategies"
import { initPushWorker } from "./push-worker"
import { ExpirationPlugin } from "workbox-expiration"

declare const self: Window & typeof globalThis & ServiceWorkerGlobalScope
export {}

precacheAndRoute(self.__WB_MANIFEST)

self.addEventListener("install", function (event) {
    console.log("Installed Service Worker")
})

const registerCacheFirstRouteUsing = (
    destination: RequestDestination,
    cacheName: string,
    maxEntries: number,
    maxAgeMins: number,
): Route => registerRoute(
    ({ request }) => request.destination === destination,
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

const CACHE_PREFIX = "iseplife-cache"
const CACHE_SCRIPT_NAME = `${CACHE_PREFIX}-scripts`
const CACHE_STYLES_NAME = `${CACHE_PREFIX}-styles`
const CACHE_DOCUMENTS_NAME = `${CACHE_PREFIX}-documents`
const CACHE_FONTS_NAME = `${CACHE_PREFIX}-fonts`
const CACHE_IMAGES_NAME = `${CACHE_PREFIX}-images`
registerCacheFirstRouteUsing("style", CACHE_STYLES_NAME, 60, 7)
registerCacheFirstRouteUsing("script", CACHE_SCRIPT_NAME, 10, 7)
registerCacheFirstRouteUsing("document", CACHE_DOCUMENTS_NAME, 5, 60 * 24 * 5)
registerCacheFirstRouteUsing("font", CACHE_FONTS_NAME, 10, 60 * 24 * 30)
registerCacheFirstRouteUsing("image", CACHE_IMAGES_NAME, 100, 60 * 24 * 10)

initPushWorker()