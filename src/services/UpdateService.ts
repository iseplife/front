import { CapacitorUpdater } from "@capgo/capacitor-updater"
import { isPlatform } from "@ionic/core"
import { message } from "antd"
import { BroadcastChannel } from "broadcast-channel"
import { t } from "i18next"

export default class UpdateService {
    broadcastChannel = new BroadcastChannel("service-worker", {
        webWorkerSupport: true,
    })
    public init() {
        const pageOpenned = Date.now()
        let updateShown = false
        this.broadcastChannel.addEventListener("message", (e) => {
            if(updateShown)
                return
            updateShown = true

            if (e == "update") {
                if (Date.now() - pageOpenned < 4_000)
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                else
                    message.info({
                        content: t("update_available").toString(),
                        duration: 10,
                        onClick: () => window.location.reload()
                    })
            }
        })
        // CapacitorUpdater.addListener("updateAvailable", async (version) => {
        //     if(updateShown)
        //         return
        //     updateShown = true
        //     console.log(version)
        //     if (Date.now() - pageOpenned < 2_500)
        //         setTimeout(() => 
        //             CapacitorUpdater.set({
        //                 version: version.version ?? (version as any ).newVersion
        //             })
        //         , 200)
        //     else if(isPlatform("android")){
        //         const last = localStorage.getItem("lastUpdates")
        //         const { versions } = await CapacitorUpdater.list()
        //         localStorage.setItem("lastUpdates", JSON.stringify(versions))
        //         if(last) {
        //             const lastVersions = JSON.parse(last) as string[]
        //             const newVersion = versions.find(version => !lastVersions.includes(version))
        //             console.debug("[Updater] Old versions were", last, "and now", versions)
        //             console.debug("[Updater] Selecting", newVersion, "for update")
        //             if(newVersion){
        //                 message.info({
        //                     content: t("update_available").toString(),
        //                     duration: 10,
        //                     onClick: () => CapacitorUpdater.set({
        //                         version: newVersion,
        //                         versionName: version.version ?? (version as any ).newVersion
        //                     })
        //                 })
        //             }
        //         }
        //     }
        // })
        
        // const last = localStorage.getItem("lastUpdates")
        // if(!last)
        //     CapacitorUpdater.list().then(({versions}) => 
        //         localStorage.setItem("lastUpdates", JSON.stringify(versions))
        //     )
        
    }
}
