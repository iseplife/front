import { isPlatform, getPlatforms } from "@ionic/core"

export const isWeb = !isPlatform("cordova")
export const isIosApp = isPlatform("ios")
export const isAndroidApp = isPlatform("android")

console.debug("Platforms :", getPlatforms())
console.log("Loaded on web :", isWeb)