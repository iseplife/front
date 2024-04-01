import React from "react"
import TakeOverCountDown from "../TakeOverCountDown/TakeOverCountDown"

interface TakeOverAnnouncementProps {
    number?:number
}

const TakeOverAnnouncement: React.FC<TakeOverAnnouncementProps> = () => {
    return(
        <div className={"flex flex-col p-4 rounded-lg bg-white relative mb-4 shadow w-full"}>

            <div className="w-full flex mb-1 relativeflex flex-col justify-center items-center ">
                <div className={" h-[30rem] absolute inset-0 bg-white rounded-lg m-4 z-1"}
                    style={{
                        backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/bg_take_over.png)`,
                        backgroundRepeat: "no-repeat",
                        backgroundSize: "cover",
                        backgroundPosition: "center",
                    }}
                />
                <div className={"justify-self-center absolute inset-0 bg-white rounded-lg opacity-80 h-28 mt-8 w-fit z-1"}

                >   <h1 className={"text-3xl text-center px-4 mt-4 text-[#fe9200] relative z-2"}>L'Ordre du Malt</h1>
                    <h2 className={"text-2xl text-center px-4 mb-8 text-[#fe9200] relative z-2"}>Prend le contrôle d'IsepLife!</h2>
                </div>


                <div className={"flex flex-col justify-center mt-[30rem] items-center 12 text-center w-full z-2 relative"}>
                    <h3 className={"text text-center mt-4 px-4"}>
                        A l'insu de tous et après une soirée bien arrosée, les membres du bureau d'ODM ont eu une idée de génie.
                        Voler IsepLife le 1er avril pour une semaine! Ça nous a fait marrer, alors on l'a fait
                    </h3>

                    <h2 className={"text-xl text-center px-4 mt-8 text-[#fe9200]"}>
                        Attendez vous à passer une semaine sous l'aune de la bière !
                    </h2>
                    <h2>Et pour courroner le tout, on vous a préparé une surprise à la fin de ce décompte...</h2>
                    <TakeOverCountDown></TakeOverCountDown>
                </div>
            </div>

        </div>
    )
}

export default TakeOverAnnouncement
