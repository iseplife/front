import { apiClient } from "../data/http"
import FingerprintJS from "@fingerprintjs/fingerprintjs"
import { notificationManager } from "../datamanager/NotificationManager"
import { getMessaging, getToken, isSupported, Messaging } from "firebase/messaging"
import { firebaseApp } from "../data/firebase"
import { PushNotifications } from "@capacitor/push-notifications"
import { isIosApp, isWeb } from "../data/app"

class PushService {
    private applicationServerKey = "BBTc25yUa0mc8n4Fv5Xjyp4bC7NHdbK98K8J9V45fGF8xeljUJNlcwRc4qiroj_8aP48EJ0GbefUNWaAr4Qr7Mk"
    fingerpringJs = FingerprintJS.load()

    private registration?: ServiceWorkerRegistration

    lastCheckSubbed = false
    firebaseMessaging?: Messaging
    capNotifRegistred = false

    async initData() {
        const supported = await isSupported()
        notificationManager.setWebPushEnabled(supported)

        if(isWeb){
            if(supported && !this.firebaseMessaging)
                try{
                    this.firebaseMessaging = getMessaging(firebaseApp)
                }catch(e){
                    console.debug("Firebase Messaging not supported !", e)
                }

            navigator.serviceWorker?.ready.then(async registration => {
                console.debug("Service worker registred")
                this.registration = registration
                notificationManager.setSubscribed(await this.checkSubscription())
            })
        }else{
            await PushNotifications.addListener("registration", token => {
                this._updateSubscriptionOnServer(token.value)
                console.info("Registration token: ", token.value)
            })
            await PushNotifications.addListener("registrationError", err => {
                console.error("Registration error: ", err.error)
            })
            await PushNotifications.addListener("pushNotificationReceived", notification => {
                console.debug("Push notification received: ", notification)
            })

            notificationManager.setSubscribed(await this.checkSubscription())
        }
    }

    async askIfNotSubbedOrRefused() {
        if(!await notificationManager.isRejected() && await notificationManager.isWebPushEnabled() && !await notificationManager.isSubscribed())
            this.subscribeUser()
    }

    public async subscribeUser() {
        try{
            let notificationAccepted = false
            
            try{
                notificationAccepted = (isWeb ? await Notification.requestPermission() : (await PushNotifications.requestPermissions()).receive) === "granted"
            }catch(e){
                console.error("e", e)
                //
            }

            if(notificationAccepted){
                if(await this.checkSubscription()){
                    console.debug("[PushService] Now subscribed.")
                }
            }else{
                console.error("[PushService] Cannot subscribe to push notifications 1")
            }
        }catch(e){
            console.error("[PushService] Cannot subscribe to push notifications 2", e)
        }
        return false
    }
    private async _updateSubscriptionOnServer(subscriptionKey: string) {
        if(localStorage.getItem("pushTokenValue") == subscriptionKey)
            return
        localStorage.setItem("pushTokenValue", subscriptionKey)
        
        notificationManager.setSubscribed(true)
        this.lastCheckSubbed = true
        await apiClient.post("/webpush/register/init", {
            subscriptionKey: subscriptionKey,
            fingerprint: (await (await this.fingerpringJs).get()).visitorId
        })
    }


    /**
     * @returns Whether or not the user is currently subscribed (and refreshes subscription if so)
     */
    private async checkSubscription(){
        if(this.lastCheckSubbed)
            return true

        if(isWeb){
            try{
                if(Notification.permission == "default" || !this.firebaseMessaging)
                    throw new Error("No token, need to accept notifications")
                    
                const token = await getToken(this.firebaseMessaging, { vapidKey: this.applicationServerKey, serviceWorkerRegistration: this.registration })
                if(!token)
                    throw new Error("No token, need to accept notifications")
    
                this._updateSubscriptionOnServer(token)
                console.debug("[PushService] Already subscribed.")
                
                return true
            }catch(err){
                console.debug("An error occurred while retrieving token.", err)
                console.debug("[PushService] Not subscribed.")
                return false
            }
        }else{
            let perm = await PushNotifications.checkPermissions()
            if(perm.receive != "granted"){
                if(isIosApp)
                    return false
                await this.subscribeUser()
                perm = await PushNotifications.checkPermissions()
            }
            if(perm.receive == "granted"){
                if(!this.capNotifRegistred){
                    this.capNotifRegistred = true
                    await PushNotifications.register()
                }
                return true
            }
            return false
        }
        return false
    }

    public refuse() {
        notificationManager.setRejected(true)
    }
}

const pushService = new PushService()
export default pushService
