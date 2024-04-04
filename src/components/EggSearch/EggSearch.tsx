import React, {useCallback, useEffect, useMemo, useState} from "react"
import {EventStudent, EventStudentPost, FoundEgg} from "../EasterEgg/EasterEgg"
import {getLoggedUser} from "../../data/student"
import {Divider} from "antd"

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
    const [_leaderBoard, setLeaderBoard] = useState<EventStudent[]>([])
    const [student, setStudent] = useState<EventStudent | null>(null)

    const [seeMore, setSeeMore] = useState(false)

    const clickSeeMore = useCallback(() => {
        setSeeMore(true)
    }, [])

    const leaderBoard = useMemo(() => {
        return seeMore ? _leaderBoard : _leaderBoard.slice(0, 2)
    }, [_leaderBoard, seeMore])



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
                <td className="px-6 py-2 bg-[#fff5e8] rounded-bl-xl whitespace-nowrap">{pos + 1}</td>
                <td className="px-6 py-2 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                <td className="px-6 py-2 bg-[#fff5e8] rounded-br-xl whitespace-nowrap">{student.lastName}</td>
            </tr>
        )
    }

    const getStudentPos = () => {
        if(!student){
            return -1
        }
        return _leaderBoard.indexOf(_leaderBoard.filter(s => s.id===student.id)[0])
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
        <div className="flex flex-col p-4 rounded-lg bg-white relative mb-4 shadow w-full">
            <div className="w-full flex justify-between mb-1 flex-col">
                <div className="flex items-center flex-col mt-2">
                    <h2 className="text-xl text-center px-4 text-[#fe9200]">On vous a aussi préparé une chasse aux oeufs dans ISEPLife !</h2>
                    <Divider className="mb-5 mt-4"></Divider>
                    <div className="flex justify-center items-center">
                        <img src={process.env.PUBLIC_URL+"/img/takeover/egg7.png"} className="w-8 h-10" alt="Oeuf de paques" />
                        <h3 className={"text-4xl text-[#fe9200] mx-4 mb-2"}>{foundEggs.length}/15</h3>
                        <img src={process.env.PUBLIC_URL+"/img/takeover/egg7.png"} className="w-8 h-10" alt="Oeuf de paques" />
                    </div>
                </div>
                <div className={"flex flex-col items-center mt-3"}>
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead>
                            <tr>
                                <th className="px-6 py-2.5 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tl-xl">Rang</th>
                                <th className="px-6 py-2.5 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider">Prénom</th>
                                <th className="px-6 py-2.5 bg-[#fe9200] text-left text-xs font-medium text-white uppercase tracking-wider rounded-tr-xl">Nom de Famille</th>
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
                                                <td className="px-6 py-2 bg-[#fff5e8] rounded-bl-xl whitespace-nowrap">{index + 1}</td>
                                                <td className="px-6 py-2 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                                                <td className="px-6 py-2 bg-[#fff5e8] rounded-br-xl whitespace-nowrap">{student.lastName}</td>
                                            </tr>
                                        )
                                    }

                                    return(
                                        <tr key={index}>
                                            <td className="px-6 py-2 bg-[#fff5e8] whitespace-nowrap">{index + 1}</td>
                                            <td className="px-6 py-2 bg-[#fff5e8] whitespace-nowrap">{student.firstName}</td>
                                            <td className="px-6 py-2 bg-[#fff5e8] whitespace-nowrap">{student.lastName}</td>
                                        </tr>
                                    )
                                })
                            }
                            <tr onClick={clickSeeMore}>
                                <td className={"px-6 py-2 bg-[#fff5e8] whitespace-nowrap text-center "+(seeMore || "text-indigo-400 cursor-pointer")} colSpan={3}>{seeMore ? "..." : "Voir plus..."}</td>
                            </tr>
                            {studentLeaderBoard()}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EggSearch
