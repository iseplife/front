import React, {useEffect, useState} from "react"
import {EventStudent, EventStudentPost, FoundEgg} from "../EasterEgg/EasterEgg"
import {getLoggedUser} from "../../data/student"

interface EggSearchProps {
    number?:number
}


async function getStudentInfo(body : EventStudentPost){
    return await fetch("https://intapi.ordredumalt.com/odm/events/getOrCreate",{
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}


async function getLeaderBoard(){
    return await fetch("https://intapi.ordredumalt.com/odm/events/leaderboard",{
        method: "GET",
        headers : {
            "Content-Type": "application/json",
        }
    })
}


const EggSearch: React.FC<EggSearchProps> = () => {

    const [foundEggs, setFoundEggs] = useState<FoundEgg[]>([])
    const [leaderBoard, setLeaderBoard] = useState<EventStudent[]>([])
    const [student, setStudent] = useState<EventStudent | null>(null)


    const studentLeaderBoard = () => {
        if(!student){
            return (<></>)
        }
        const pos = getStudentPos()+1

        if(pos <= 5){
            return (<></>)
        }

        return (
            <tr key={pos}>
                <td className="px-6 py-4 bg-[#fff5e8] rounded-bl-xl whitespace-nowrap">{pos + 1}</td>
                <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                <td className="px-6 py-4 bg-[#fff5e8] rounded-br-xl whitespace-nowrap">{student.lastName}</td>
            </tr>
        )
    }

    const getStudentPos = () => {
        if(!student){
            return -1
        }
        return leaderBoard.indexOf(leaderBoard.filter(s => s.id===student.id)[0])
    }


    useEffect(() => {
        getLoggedUser()
            .then(result => {
                const student = result.data
                if(!student){
                    return
                }
                getStudentInfo({
                    id:student.id,
                    firstName:student.firstName,
                    lastName:student.lastName
                })
                    .then(result => {
                        if(result.status == 200){
                            return result.json()
                        }
                        console.log("oups l'erreur")
                    })
                    .then(data => {
                        const es = data as EventStudent
                        setStudent(es)
                        setFoundEggs(es.eventInfo)
                    })
            })

    }, [])

    useEffect(() => {
        getLeaderBoard()
            .then(result => result.json())
            .then(data => {
                const leaderBoard = data as EventStudent[]
                setLeaderBoard(leaderBoard)
            })
    }, [])

    return(
        <div className={"flex flex-col p-4 rounded-lg bg-white relative mb-4 shadow w-full"}>
            <div className="w-full flex justify-between mb-1 flex-col">
                <div className={"flex items-center flex-col mt-6"}>
                    <h2 className={"text-3xl text-center my-8 px-4 text-[#fe9200]"}>L'Ordre du Malt vous a aussi préparé une chasse aux oeufs !</h2>
                    <h2 className={"mb-8"}>Soit le premier à trouver les 15 oeufs cachés dans l'application!</h2>
                    <h2 className={"text-2xl text-center"}>Oeufs que tu as trouvés :</h2>
                    <div className={"flex justify-center items-center"}>
                        <div
                            className="w-[39px] h-[48px] md:w-[78px] md:h-[96px]"
                            style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/egg7.png)`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                        <h3 className={"text-5xl md:text-7xl mt-4 text-[#fe9200] mx-4"}>{foundEggs.length}/15</h3>
                        <div
                            className="w-[39px] h-[48px] md:w-[78px] md:h-[96px]"
                            style={{
                                backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/egg7.png)`,
                                backgroundRepeat: "no-repeat",
                                backgroundSize: "cover",
                                backgroundPosition: "center",
                            }}
                        />
                    </div>
                </div>
                <div className={"flex flex-col items-center mt-8"}>
                    <h2 className={"text-2xl text-center"}>Leader board</h2>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr className={""}>
                                <th className="px-6 py-3 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-xl">Rang</th>
                                <th className="px-6 py-3 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
                                <th className="px-6 py-3 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-xl">Nom de Famille</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {
                                leaderBoard.map((student, index) => {
                                    if(index>=5){
                                        return(<></>)
                                    }
                                    if(index == 4 || (index <4 && leaderBoard.length-1==index) && getStudentPos()+1<=5){
                                        return(
                                            <tr key={index}>
                                                <td className="px-6 py-4 bg-[#fff5e8] rounded-bl-xl whitespace-nowrap">{index + 1}</td>
                                                <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                                                <td className="px-6 py-4 bg-[#fff5e8] rounded-br-xl whitespace-nowrap">{student.lastName}</td>
                                            </tr>
                                        )
                                    }

                                    return(
                                        <tr key={index}>
                                            <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                                            <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">{student.lastName}</td>
                                        </tr>
                                    )
                                })
                            }
                            {getStudentPos()+1>5?
                                <tr>
                                    <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap"></td>
                                    <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap">...</td>
                                    <td className="px-6 py-4 bg-[#fff5e8] whitespace-nowrap"></td>
                                </tr>
                                :
                                <></>
                            }
                            {studentLeaderBoard()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EggSearch
