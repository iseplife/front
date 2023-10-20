import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useCallback, useEffect, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { AvatarSizes } from "../../constants/MediaSizes"
import { ClubMemberPreview, ClubRoleIcon } from "../../data/club/types"
import { getStudentClubs } from "../../data/student"
import { StudentPreview } from "../../data/student/types"
import { getCurrentSchoolYear, mediaPath } from "../../util"

const StudentClubs: React.FC<{student?: StudentPreview}> = ({ student }) => {

    const [selectSchoolSession, setSelectedSchoolSection] = useState(getCurrentSchoolYear())
    const [clubs, setClubs] = useState<ClubMemberPreview[]>()

    const {t} = useTranslation("user")

    useEffect(() => {
        if(student)
            getStudentClubs(student.id).then(res => setClubs(res.data))
    }, [student, student?.id])

    const clubsShowed = useMemo(() => {
        return clubs?.filter(c => c.fromYear >= selectSchoolSession && c.toYear <= selectSchoolSession) ?? []
    }, [clubs, selectSchoolSession])
    
    const schoolSessions = useMemo(() => {
        const list: number[] = []

        if(clubs)
            for (const c of clubs) {
                const clubYears = []
                for (let year = c.fromYear; year <= c.toYear; year++) {
                    clubYears.push(year)
                }
                list.push(...clubYears.filter(y => !list.includes(y)))
            }

        if(!list.includes(getCurrentSchoolYear()))
            list.push(getCurrentSchoolYear())

        return list.sort((a, b) => a - b)

    }, [clubs])

    return <div>

        <div className="flex justify-end space-x-4 text-lg mt-8 px-2">
            {schoolSessions.map((s, i) =>
                <div key={i} className={"h-hull flex items-center font-bold border-b-2 " + (selectSchoolSession == s ? "text-indigo-600 border-indigo-600" : "cursor-pointer border-transparent")} onClick={() => setSelectedSchoolSection(s)}>{s}</div>
            )}
        </div>

        <div className="flex flex-wrap mt-2 mb-8 w-full">
            {clubs ?
                clubsShowed.length > 0 ? clubsShowed.map(club => 
                    <div className="w-1/2 md:w-1/3 xl:w-1/4 p-2">
                        <Link to={`/club/${club.club.id}`} className="mx-auto block w-full group">
                            <div
                                className="relative bg-white rounded-t-2xl px-4 overflow-hidden hover:shadow-sm w-full items-end flex aspect-[18/20] bg-[length:112%] group-hover:bg-[length:118%] transition-all"
                                style={{
                                    backgroundImage: `url("${mediaPath(club.club.logoUrl, AvatarSizes.FULL)}")`,
                                    backgroundRepeat: "no-repeat",
                                    backgroundSize: "112%",
                                    backgroundPosition: "center",
                                }}
                            >
                                <div className="bg-white/50 rounded-xl backdrop-blur grid place-items-center px-2 py-1 leading-6 mb-3 mt-auto ml-auto text-neutral-900 font-semibold text-sm">
                                    <div className="line-clamp-2 text-ellipsis text-center max-w-full">
                                        {club.position}                
                                    </div>
                                </div>
                               
                            </div>
                            <div className="bg-white rounded-b-lg text-base text-center text-neutral-900 px-2 font-semibold h-10 flex items-center justify-center">
                                <span className="overflow-hidden text-ellipsis line-clamp-1">{club.club.name}</span>
                            </div>
                        </Link>
                    </div>
                ) :
                    <div className="text-neutral-600 mt-8 mx-auto">{t("user:no_club", {user: `${student?.firstName} ${student?.lastName}`})}</div>
                :
                [1, 2, 3].map((i) =>
                    <div key={i} className="w-1/2 md:w-1/3 xl:w-1/4 p-2">
                        <div className="bg-white block w-full rounded-lg shadow-sm">
                            <div className="w-full aspect-[18/20] rounded-t-lg bg-gray-300 animate-pulse">

                            </div>
                            <div className="h-10 flex items-center justify-center">
                                <div className="bg-gray-300 h-6 animate-pulse rounded-full w-2/3"></div>
                            </div>
                        </div>                  
                    </div>
                )
            }
        </div>
    </div>
}

export default StudentClubs