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
        this.broadcastChannel.addEventListener("message", (e) => {
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
        CapacitorUpdater.addListener("updateAvailable", () => {
            if (Date.now() - pageOpenned < 2_500)
                setTimeout(() => 
                    CapacitorUpdater.reload()
                , 200)
            else if(isPlatform("android"))
                message.info({
                    content: t("update_available").toString(),
                    duration: 10,
                    onClick: () => CapacitorUpdater.reload()
                })
        })
    }
}
