import React, {useEffect, useState} from "react"
import {floor} from "lodash"

interface TakeOverCountDownProps {
    number?:number
}

const TakeOverCountDown: React.FC<TakeOverCountDownProps> = () => {

    const releaseDate = new Date(2024,3,3,12)
    const [hours, setHours] = useState<string>("00")
    const [minutes, setMinutes] = useState<string>("00")
    const [seconds, setSeconds] = useState<string>("00")


    const [ticking, setTicking] = useState(true),
        [count, setCount] = useState(0)

    useEffect(() => {
        const timer = setTimeout(() => ticking && setCount(count+1), 1e3)
        const d = new Date()
        const time = floor((releaseDate.getTime() - d.getTime())/1000)
        const minTot = floor(time/60)

        const s = time % 60
        const h = floor(minTot/60)
        const m = minTot % 60

        if(h*m*s < 0){
            setTicking(false)
            setHours("00")
            setMinutes("00")
            setSeconds("00")
            return
        }
        if(h.toString().length === 1){
            setHours("0"+h.toString())
        }else {
            setHours(h.toString())
        }

        if(m.toString().length === 1){
            setMinutes("0"+m.toString())
        }else {
            setMinutes(m.toString())
        }

        if(s.toString().length === 1){
            setSeconds("0"+s.toString())
        }else {
            setSeconds(s.toString())
        }





        return () => clearTimeout(timer)
    }, [count, ticking])

    useEffect(() => {

        console.log(releaseDate)

    }, [])



    return (
        <div>
            <h2 className={"text-5xl my-8"}>{hours} : {minutes} : {seconds}</h2>
            {ticking?
                <></>
                :
                <div className={"flex flex-col items-center justify-center p-4 rounded-xl cursor-pointer hover:border hover:border-black hover:bg-[#fff5e8]"}
                    onClick={() => window.open("https://ordredumalt.com")}
                >
                    <img src={process.env.PUBLIC_URL+"/img/takeover/logoODM.png"}/>
                    <h1 className={"text-xl text-center"}>Retrouvez tous nous produits sur notre nouveau site ! ordredumalt.com</h1>
                </div>

            }
        </div>
    )
}
export default TakeOverCountDown
