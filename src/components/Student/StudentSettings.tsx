import React, {useCallback} from "react"
import ParameterSwitch from "./ParameterSwitch"
import {Student, StudentSettings as StudentSettingsType} from "../../data/student/types"
import LanguagePicker from "./LanguagePicker"
import {updateSettings} from "../../data/student"
import {message} from "antd"
import {useTranslation} from "react-i18next"
import StudentImageUploader from "./StudentImageUploader"

type StudentSettingsProps = {
    info: Student
}
const StudentSettings: React.FC<StudentSettingsProps> = ({info}) => {
    const {t} = useTranslation(["setting", "common"])
    const handleChange = useCallback( (key: keyof StudentSettingsType) => (value: unknown) => {
        updateSettings({
            [key]: value
        }).catch(() => message.error(t("common:error")))
    }, [])


    return (
        <>
            <div className="md:w-1/2 w-full py-5 px-10">
                <h4 className="text-gray-700 text-lg">{t("image-uploader")}: </h4>
                <StudentImageUploader {...info.pictures}/>
            </div>
            <div className="md:w-1/2 w-full">
                {/* <ParameterSwitch name="recognition" value={info.recognition} onChange={handleChange("recognition")} /> */}
                {/* <ParameterSwitch name="notification" value={info.notification} onChange={handleChange("notification")} /> */}
                <ParameterSwitch name="nsfw" value={Boolean(localStorage.getItem("nsfw")) || true} onChange={v => localStorage.setItem("nsfw", String(v))} />
                <LanguagePicker />
            </div>
        </>
    )
}
export default StudentSettings