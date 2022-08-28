import { isPlatform, getPlatforms } from "@ionic/core"

export const isWeb = !isPlatform("cordova")

console.debug("Platforms :", getPlatforms())
console.log("Loaded on web :", isWeb)