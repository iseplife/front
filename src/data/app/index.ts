import { isPlatform, getPlatforms } from "@ionic/core"
import {isWebKit as isWebKitFP} from "@fingerprintjs/fingerprintjs"

export const isWeb = !isPlatform("cordova")
export const isIosApp = isPlatform("ios")
export const isAndroidApp = isPlatform("android")
export const isWebKit = navigator.userAgent.includes("AppleWebKit") || isWebKitFP()

console.debug("Platforms :", getPlatforms())
console.log("Loaded on web :", isWeb)