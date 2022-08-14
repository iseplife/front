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
                if (Date.now() - pageOpenned < 5_000)
                    setTimeout(() => {
                        location.reload()
                    }, 500)
                else
                    message.info(t("update_available").toString(), 10_000, () =>
                        location.reload()
                    )
            }
        })
    }
}
