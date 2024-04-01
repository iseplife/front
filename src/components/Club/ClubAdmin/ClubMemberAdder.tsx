import React, {useCallback, useMemo, useState} from "react"
import {ClubMember, ClubMemberCreationForm, ClubRole, ClubRoleIcon, ClubRoles} from "../../../data/club/types"
import {useTranslation} from "react-i18next"
import StudentPicker from "../../Student/StudentPicker"
import {message, Select} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {addClubMember} from "../../../data/club"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {SearchItem} from "../../../data/searchbar/types"
import {faPlus, faTimes, faUser} from "@fortawesome/free-solid-svg-icons"
import { WebPAvatarPolyfill } from "../../Common/WebPPolyfill"
import MemberCardToolbar from "./MemberCardToolbar"

const {Option} = Select

type ClubMemberAdderProps = {
    club: number
    year: number
    onAdd: (cm: ClubMember) => void
}
const ClubMemberAdder: React.FC<ClubMemberAdderProps> = ({club, year, onAdd}) => {
    const {t} = useTranslation("club")
    const [clicked, setClicked] = useState<boolean>(false)
    const [student, setStudent] = useState<SearchItem>()
    const initialValues: ClubMemberCreationForm = useMemo(() => ({
        student: -1,
        position: "Membre",
        role: ClubRole.MEMBER,
        year: year
    }), [year])

    const toggleForm = useCallback((open: boolean) => {
        setClicked(open)
        setStudent(undefined)
    }, [])

    const onStudentSelect = useCallback((setFieldValue: (field: string, value: any, shouldValidate?: boolean) => void) => (id: number, metadata: SearchItem) => {
        setFieldValue("student", id)
        setStudent(metadata)
    }, [])

    const createMember = useCallback((values: ClubMemberCreationForm, helpers: FormikHelpers<ClubMemberCreationForm>) => {
        addClubMember(club, values).then(res => {
            onAdd(res.data)
            setStudent(undefined)
            setClicked(false)
            message.success(t("member_created"))

            helpers.resetForm({values: initialValues})
        })
    }, [club, initialValues, onAdd, t])

    return (
        <Formik<ClubMemberCreationForm> onSubmit={createMember} initialValues={initialValues}>
            {({values, setFieldValue}) => (
                <div
                    className="w-full text-center mt-2">
                    { clicked  ?
                        <Form className="flex flex-col sm:flex-row space-x-4 items-center">

                            <StudentPicker className="my-auto w-full rounded-scroller" onChange={onStudentSelect(setFieldValue)}/>
                            <div className="mt-2 sm:mt-0 space-x-4 whitespace-nowrap">
                                <button disabled={!student} type="submit" className="font-bold cursor-pointer rounded-full px-4 py-2 bg-[#fe9200] hover:bg-opacity-90 text-white whitespace-nowrap">
                                    <FontAwesomeIcon icon={faPlus} size="1x" className="mr-2"/>
                                    {t("add")}
                                </button>
                                <FontAwesomeIcon onClick={() => toggleForm(false)} icon={faTimes} className="text-xl cursor-pointer text-red-400 hover:text-red-600"/>
                            </div>                          
                        </Form>
                        
                        : <button
                            onClick={() => toggleForm(true)}
                            type="submit" className="font-bold cursor-pointer rounded-full px-4 py-2 bg-[#fe9200] hover:bg-opacity-90 text-white"
                        >
                            <FontAwesomeIcon icon={faPlus} size="1x" className="mr-2"/>
                            {t("add")}
                        </button>
                    }
                </div>
            )}
        </Formik>
    )
}

export default ClubMemberAdder
