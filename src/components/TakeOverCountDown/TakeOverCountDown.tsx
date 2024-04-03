import React from "react"

interface TakeOverCountDownProps {
    number?:number
}

const TakeOverCountDown: React.FC<TakeOverCountDownProps> = () => {

    return (
        <div>
            <a href="https://ordredumalt.com" className="flex gap-6 w-full flex-row items-center justify-center p-4 rounded-xl cursor-pointer border border-opacity-0 hover:border-opacity-90 border-black bg-[#fff5e8] hover:bg-[#fff5e8]">
                <img src={process.env.PUBLIC_URL+"/img/takeover/logoODM.webp"} className="w-16 h-16"/>
                <h1 className="text-base text-center flex items-center w-8/12">Retrouvez tous nous produits sur notre nouveau site !</h1>
            </a>
        </div>
    )
}
export default TakeOverCountDown
