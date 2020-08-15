import React from "react"
import {ClubMember, ClubMemberForm, ClubRoles} from "../../../data/club/types"
import {Avatar, Button, Input, Select} from "antd"
import {UserOutlined, CloseCircleOutlined, DeleteOutlined, SaveOutlined} from "@ant-design/icons"
import {useTranslation} from "react-i18next"
import {useFormik} from "formik"

const {Option} = Select

type ClubMemberEditorProps = {
    member: ClubMember
    onCancel: () => void
}
const ClubMemberEditor: React.FC<ClubMemberEditorProps> = ({member, onCancel}) => {
    const {t} = useTranslation(["club", "common"])
    const formik = useFormik<ClubMemberForm>({
        enableReinitialize: true,
        initialValues: {
            role: member.role,
            position: member.position
        },
        onSubmit: (values) => {
            console.log(values)
        }
    })

    return (
        <div className="h-full">
            <div className="w-full flex justify-between items-center">
                <h1 className="font-dinotcb text-xl text-gray-600 uppercase">{t("edit_member")}</h1>
                <CloseCircleOutlined className="text-gray-600 hover:text-gray-400" onClick={onCancel}/>
            </div>

            <form className="flex flex-col items-center -mt-3 p-3 h-full" onSubmit={formik.handleSubmit}>
                <div className="text-center">
                    <Avatar src={member.student.picture} icon={<UserOutlined/>}/>
                    <h3 className="font-dinotcb text-xl text-gray-500">{member.student.firstName + " " + member.student.lastName}</h3>
                </div>

                <div className="flex flex-col items-center mb-3">
                    <label className="font-dinotcb">{t("form.role")}</label>
                    <Select value={formik.values.role} className="w-32" onChange={(value) => formik.setFieldValue("role", value)}>
                        {ClubRoles.map(r =>
                            <Option key={r} value={r}>{t("role." + r)}</Option>
                        )}
                    </Select>
                </div>
                <div>
                    <label className="font-dinotcb">{t("form.position")}</label>
                    <Input name="position" value={formik.values.position} onChange={formik.handleChange}/>
                </div>

                <div className="self-end flex flex-wrap justify-around w-full mt-4">
                    <Button htmlType="submit" type="primary" icon={<SaveOutlined/>}>
                        {t("common:save")}
                    </Button>
                    <Button danger icon={<DeleteOutlined/>} onClick={undefined}>
                        {t("common:delete")}
                    </Button>
                </div>
            </form>

        </div>
    )
}

export default ClubMemberEditor