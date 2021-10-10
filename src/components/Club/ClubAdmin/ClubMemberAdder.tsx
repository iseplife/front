import React, {useCallback, useMemo, useState} from "react"
import {ClubMember, ClubMemberCreationForm, ClubRole, ClubRoleIcon, ClubRoles} from "../../../data/club/types"
import {useTranslation} from "react-i18next"
import StudentPicker from "../../Student/StudentPicker"
import {Avatar, Badge, message, Select} from "antd"
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome"
import {addClubMember} from "../../../data/club"
import {Field, Form, Formik, FormikHelpers} from "formik"
import {mediaPath} from "../../../util"
import {AvatarSizes} from "../../../constants/MediaSizes"
import {SearchItem} from "../../../data/searchbar/types"
import MemberCardToolbar from "./MemberCardToolbar"

const {Option} = Select

type ClubMemberAdderProps = {
    club: number
    year: number
    onAdd: (cm: ClubMember) => void
}
const ClubMemberAdder: React.FC<ClubMemberAdderProps> = ({club, year, onAdd}) => {
    const {t} = useTranslation("club")
    const [student, setStudent] = useState<SearchItem>()
    const initialValues: ClubMemberCreationForm = useMemo(() => ({
        student: -1,
        position: "Membre",
        role: ClubRole.MEMBER,
        year: year
    }), [year])

    const onStudentSelect = useCallback((setFieldValue) => (id: number, metadata: SearchItem) => {
        setFieldValue("student", id)
        setStudent(metadata)
    }, [])

    const createMember = useCallback((values: ClubMemberCreationForm, helpers: FormikHelpers<ClubMemberCreationForm>) => {
        addClubMember(club, values).then(res => {
            onAdd(res.data)
            setStudent(undefined)
            message.success(t("member_created"))

            helpers.resetForm({values: initialValues})
        })
    }, [club, onAdd])

    return (
        <Formik<ClubMemberCreationForm> onSubmit={createMember} initialValues={initialValues}>
            {({values, setFieldValue}) => (
                <MemberCardToolbar isEdited={true} onUndo={() => setStudent(undefined)} visible={student != undefined}>
                    <div
                        className="h-20 w-full sm:h-60 sm:w-44 p-2 sm:p-3 pb-2 m-2 shadow-md flex sm:flex-col flex-row items-center bg-white rounded-lg overflow-hidden">
                        {student ?
                            <>
                                <Avatar
                                    src={mediaPath(student.thumbURL, AvatarSizes.DEFAULT)}
                                    alt={student.name}
                                    shape="square"
                                    className="sm:w-full h-full w-1/3 rounded-lg"
                                />
                                <div className="sm:text-center text-left mt-0 ml-2 sm:mt-2 sm:ml-0 w-2/3 sm:w-full">
                                    <h5 className="font-bold text-xl mb-0 truncate">
                                        {student.name}
                                    </h5>
                                    <Form className="flex justify-around text-md text-gray-500">
                                        <Field
                                            name="position"
                                            className="w-3/5 mr-1 font-bold focus:text-gray-600 focus:outline-none border-b"
                                        />
                                        <Select
                                            value={values.role}
                                            onChange={value => setFieldValue("role", value)}
                                        >
                                            {ClubRoles.map(r =>
                                                <Option key={r} value={r}>
                                                    <FontAwesomeIcon
                                                        className="ml-1"
                                                        icon={ClubRoleIcon[r]}
                                                        title={t("club:role." + r)}
                                                    />
                                                </Option>
                                            )}
                                        </Select>
                                    </Form>
                                </div>
                            </> :
                            <StudentPicker className="my-auto w-full" onChange={onStudentSelect(setFieldValue)}/>
                        }
                    </div>
                </MemberCardToolbar>
            )}
        </Formik>
    )
}

export default ClubMemberAdder
