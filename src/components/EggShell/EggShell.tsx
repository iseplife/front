import React, {useEffect, useState} from "react"
import {LoggedStudentPreview} from "../../data/student/types"
import {getLoggedUser} from "../../data/student"
import {FoundEgg} from "../EasterEgg/EasterEgg"

interface EggShellProps {
    id:number
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
    eggShells : FoundShell[]
}

export interface FoundShell{
    id:number
}

interface PostFoundShell{
    studentId:number
    firstName:string,
    lastName:string
    shellId:number
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

async function getShell(body:PostFoundShell){
    return await fetch("https://intapi.ordredumalt.com/odm/events/eggshell",{
        method: "POST",
        headers : {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(body),
    })
}

const EggShell: React.FC<EggShellProps> = ({id}) => {

    const [foundShells, setFoundShells] =
        useState<FoundShell[]>([])

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
                        setFoundShells(es.eggShells)
                    })
            })



    }, [])

    if (foundShells.map(elem => elem.id).includes(id) || !studentInfo){
        return(<></>)
    }


    return(
        <div className={"flex justify-center items-center flex-col cursor-pointer"}
            onClick={
                () => getShell({
                    studentId:studentInfo?.id,
                    firstName:studentInfo?.firstName,
                    lastName:studentInfo?.lastName,
                    shellId:id,
                })
                    .then(result => result.json())
                    .then(data => {
                        const es = data as EventStudent
                        setFoundShells(es.eggShells)
                    })
                    .catch((error) => console.log(error))
            }
        >
            <div
                className="w-[39px] h-[48px]"
                style={{
                    backgroundImage: `url(${process.env.PUBLIC_URL}/img/takeover/shell.png)`,
                    backgroundRepeat: "no-repeat",
                    backgroundSize: "cover",
                    backgroundPosition: "center",
                }}
            />
            <p className={"text-center"}>Coquille d'oeuf</p>
        </div>
    )
}

export default EggShell
