import React, { useContext } from "react"
import { AppContext } from "../../context/app/context"
import { useTranslation } from "react-i18next"
import SubscriptionButton from "../Subscription/SubscriptionButton"
import { SubscribableType } from "../../data/subscription/SubscribableType"

const FirstFollow: React.FC = () => {
    const { t } = useTranslation("notifications")
    const { state: { user } } = useContext(AppContext)

    return (
        <div className="fixed top-0 left-0 bg-black/40 backdrop-blur-sm w-screen h-screen z-[9999] flex flex-col p-3 box-border sm:p-0">
            <div className="w-full text-white text-center mt-5 sm:mt-10">
                <div className="text-5xl sm:text-7xl font-bold">
                    Suivez des associations
                </div>
                <div className="text-xl sm:text-3xl font-medium text-white/70 mt-3">
                    Vous devez suivre les associations pour voir leurs posts dans votre feed.
                    {/* Choisissez-en au moins 5 pour commencer ! */}
                </div>
            </div>

            <div className="rounded-xl bg-neutral-100 p-4 sm:p-8 m-auto my-6 sm:my-14 h-full max-w-full">
                <div className="flex">
                    <img src="https://iseplife-dev.s3.eu-west-3.amazonaws.com/img/clb/90x90/GgdZa1Uea4KPpTng4mxiiMh3wg8bwt.jpg"
                        className="rounded-full h-14 w-14 sm:w-16 sm:h-16 "/>
                    <div className="ml-2 sm:ml-4">
                        <div className="font-bold text-lg sm:text-xl mb-0.5">Orphoz</div>
                        <div className="text-sm text-black/[65%] font-normal leading-4 w-96">
                            Orphoz est le Bureau Des Élèves de l’ISEP.
                            <br />
                            Ils organisent la vie associative, des évènements et soirées.
                        </div>
                    </div>
                    <div className="h-16 flex items-center ml-8">
                        <SubscriptionButton id={0} subscribed={false} type={SubscribableType.CLUB} updateSubscription={()=>console.log("lol")} />
                    </div>
                </div>
                <div className="h-0.5 bg-black/5 w-full my-4 rounded-full"></div>
            </div>
        </div>
    )
}
export default FirstFollow