import React from "react"
import TakeOverCountDown from "../TakeOverCountDown/TakeOverCountDown"

interface TakeOverAnnouncementProps {
    number?:number
}

const TakeOverAnnouncement: React.FC<TakeOverAnnouncementProps> = () => {
    return(
        <div className={"flex flex-col p-4 rounded-lg bg-white relative mb-4 shadow w-full"}>

            <div className="flex mb-1 relative w-full flex-col justify-center items-center ">
                <div className="bg-white rounded-lg z-1 w-full grid place-items-center"
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/bg_take_over.webp)`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                >
                    <div className="justify-self-center inset-0 bg-neutral-800/60 shadow-sm backdrop-blur-md rounded-lg p-2 px-3 mx-2 my-6 w-fit z-1">
                        <div className={"text-3xl text-center text-[#fe9200] relative z-2 font-bold"}>L'Ordre du Malt</div>
                        <div className={"text-xl text-center text-[#fe9200] relative z-2 opacity-90"}>Prend le contrôle d'IsepLife!</div>
                    </div>
                </div>


                <div className={"flex flex-col justify-center items-center text-center w-full z-2 relative"}>
                    <h3 className={"text text-center mt-4 px-4"}>
                        A l'insu de tous et après une soirée bien arrosée, les membres du bureau d'ODM ont eu une idée de génie.
                        Voler IsepLife le 1er avril pour une semaine! Ça nous a fait marrer, alors on l'a fait
                    </h3>

                    <TakeOverCountDown></TakeOverCountDown>
                </div>
            </div>

        </div>
    )
}

export default TakeOverAnnouncement
