import React, {useCallback, useState} from "react"
import StudentSelector from "../../Student/StudentSelector"
import {useTranslation} from "react-i18next"
import {Button} from "antd"

type AddMemberProps = {
    onAdd: (id: number) => void
}
const AddMember: React.FC<AddMemberProps> = ({onAdd}) => {
    const {t} = useTranslation("group")
    const [values, setValues] = useState<number[]>([])

    const handleClick = useCallback(() => {
        setValues(v => {
            v.forEach(onAdd)
            return []
        })
    }, [onAdd])

    return (
        <div className="flex no-wrap items-center">
            <StudentSelector onChange={setValues} className="w-40 rounded-scroller mx-1" placeholder={t("add_member")} />
            <Button disabled={values.length === 0} onClick={handleClick} className="mx-1 rounded-lg" size="small">
                {t("confirm_add")}
            </Button>
        </div>
    )
}

export default AddMember