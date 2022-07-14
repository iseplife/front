import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import { useEffect, useState } from "react"
import { useTranslation } from "react-i18next"
import { Link } from "react-router-dom"
import { AvatarSizes } from "../../constants/MediaSizes"
import { ClubMemberPreview, ClubRoleIcon } from "../../data/club/types"
import { getStudentClubs } from "../../data/student"
import { StudentPreview } from "../../data/student/types"
import { mediaPath } from "../../util"

const StudentClubs: React.FC<{student?: StudentPreview}> = ({ student }) => {
    const [clubs, setClubs] = useState<ClubMemberPreview[]>()
    const {t} = useTranslation("user")

    useEffect(() => {
        if(student)
            getStudentClubs(student.id).then(res => setClubs(res.data))
    }, [student?.id])
    return <div className="flex gap-5 flex-wrap mt-5 w-full">
        {clubs ?
            clubs.length > 0 ? clubs.map(club => 
                <Link to={`/club/${club.club.id}`} className="mx-auto">
                    <div
                        className="relative mx-1 bg-white rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-48 px-4 items-end flex aspect-[18/20]"
                        style={{
                            backgroundImage: `url("${mediaPath(club.club.logoUrl, AvatarSizes.DEFAULT)}")`,
                            backgroundRepeat: "no-repeat",
                            backgroundSize: "147%",
                            backgroundPosition: "center",
                        }}
                    >
                        <FontAwesomeIcon className="absolute left-2 top-2 text-white/80 drop-shadow-sm text-xl" icon={ClubRoleIcon[club.role]}/>

                        <div className="bg-white/40 rounded-xl backdrop-blur grid place-items-center px-3 py-1 mb-3 mt-auto w-full text-neutral-800 font-semibold text-2xl">
                            {club.club.name}
                            <span className="text-sm font-bold text-neutral-600 text-center">
                                {club.position}
                            </span>
                        </div>
                    </div>
                </Link>
            ) :
                <div className="text-neutral-600 mx-auto">{t("user:no_club", {user: `${student?.firstName} ${student?.lastName}`})}</div>
            :
            [1, 2, 3].map(() =>
                <div
                    className="mx-1 bg-neutral-200 animate-pulse rounded-2xl overflow-hidden hover:shadow-sm transition-shadow h-48 px-4 items-end flex aspect-[18/20]"
                />
            )
        }
    </div>
}

export default StudentClubs