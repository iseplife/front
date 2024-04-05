import React, {useEffect, useState} from "react"
import {LoggedStudentPreview} from "../../data/student/types"
import {getLoggedUser} from "../../data/student"

interface EasterEggProps {
    id:number
    name:string
}

export interface EventStudentPost{
    id:number
    firstName:string,
    lastName:string
}

export interface EventStudent{
    id:number
    firstName:string,
    lastName:string
    eventInfo : FoundEgg[]
}

export interface FoundEgg{
    id:number
    createdAt:Date
}

interface PostFoundEgg{
    studentId:number
    firstName:string,
    lastName:string
    eggId:number
    eggName:string
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

async function getEgg(body:PostFoundEgg){
    return await fetch("https://intapi.ordredumalt.com/odm/events/found_egg",{
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

const EasterEgg: React.FC<EasterEggProps> = ({id,name}) => {

    const [foundEggs, setFoundEggs] =
        useState<FoundEgg[]>([])

    const [studentInfo, setStudentInfo] =
        useState<LoggedStudentPreview | null>(null)

    useEffect(() => {
        getLoggedUser()
            .then(result => {
                setStudentInfo(result.data)
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
                        setFoundEggs(es.eventInfo)
                    })
            })



    }, [])

    if (foundEggs.map(elem => elem.id).includes(id) || !studentInfo){
        return(<></>)
    }


    return(
        <div className={"flex justify-center items-center flex-col cursor-pointer"}
            onClick={
                () => getEgg({
                    studentId:studentInfo?.id,
                    firstName:studentInfo?.firstName,
                    lastName:studentInfo?.lastName,
                    eggId:id,
                    eggName:name
                })
                    .then(result => result.json())
                    .then(data => {
                        const es = data as EventStudent
                        setFoundEggs(es.eventInfo)
                    })
                    .catch((error) => console.log(error))
            }
        >
            <div
                className="w-[39px] h-[48px]"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/egg${id%8}.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <p className={"text-center"}>Oeuf {name}</p>
        </div>
    )
}

export default EasterEgg
