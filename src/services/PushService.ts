import { apiClient } from "../data/http"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { notificationManager } from "../datamanager/NotificationManager"

class PushService {
    private applicationServerKey = "BLWwNN2_bMjIeoh9JDxSVIx2qwrBchWDMHrb6nD1nDijSMoq6ZidqapvWMv5Git2SrObd8Do9glexD9wT-jECnY"
    fingerpringJs = FingerprintJS.load()

    private registration?: ServiceWorkerRegistration

    lastCheckSubbed = false

    constructor() {
        navigator.serviceWorker?.ready.then(async registration => {
            this.registration = registration
            notificationManager.setSubscribed(await this.checkSubscription())
        })
    }
    async initData() {
        notificationManager.setWebPushEnabled("PushManager" in window)
    }

    public async subscribeUser() {
        try{
            const subscription = await this.registration?.pushManager.subscribe({
                userVisibleOnly: true,
                applicationServerKey: this.applicationServerKey
            })

            if(!subscription)
                return false

            console.log("[PushService] Now subscribed.")
            this._updateSubscriptionOnServer(subscription)
        }catch(e){
            console.error("[PushService] Cannot subscribe to push notifications", e)
        }
        return false
    }
    private async _updateSubscriptionOnServer(subscription: PushSubscription) {
        notificationManager.setSubscribed(true)
        this.lastCheckSubbed = true
        // Get public key and user auth from the subscription object
        const key = subscription.getKey ? subscription.getKey("p256dh") : ""
        const auth = subscription.getKey ? subscription.getKey("auth") : ""
        await apiClient.post("/webpush/register/init", {
            endpoint: subscription.endpoint,
            // Take byte[] and turn it into a base64 encoded string suitable for
            // POSTing to a server over HTTP
            key: key ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(key)))) : "",
            auth: auth ? btoa(String.fromCharCode.apply(null, Array.from(new Uint8Array(auth)))) : "",
            fingerprint: (await (await this.fingerpringJs).get()).visitorId
        })
    }


    /**
     * @returns Whether or not the user is currently subscribed (and refreshes subscription if so)
     */
    private async checkSubscription(){
        if(this.lastCheckSubbed)
            return true

        const subscription = await this.registration?.pushManager.getSubscription()
        const isSubscribed = !!subscription

        if (isSubscribed) {
            this._updateSubscriptionOnServer(subscription)
            console.log("[PushService] Already subscribed.")
        } else
            console.log("[PushService] Not subscribed.")

        return isSubscribed
    }

    public refuse() {
        notificationManager.setRejected(true)
    }
}

const pushService = new PushService()
export default pushService