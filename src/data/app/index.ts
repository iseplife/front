import { isPlatform, getPlatforms } from "@ionic/core"

export const isWeb = !isPlatform("cordova")
export const isIosApp = isPlatform("ios")

console.debug("Platforms :", getPlatforms())
console.log("Loaded on web :", isWeb)