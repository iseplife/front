import React, {useMemo} from "react"
import {useTranslation} from "react-i18next"
import {Switch} from "antd"

type ParameterSwitchProps = {
    name: string
    value: boolean
    onChange: (value: boolean) => void
}
const ParameterSwitch: React.FC<ParameterSwitchProps> = ({name, value, onChange}) => {
    const {t} = useTranslation("setting")
    const state = useMemo(() => value ? "enable": "disable", [value])

    return (
        <div className="my-5">
            <h4 className="text-gray-700 font-dinotcb text-lg">{t(`${name}.title`)}</h4>
            <div className="flex items-center">
                <Switch className="mr-2" defaultChecked={value} onChange={onChange}/> <span>{t(`${name}.${state}`)}</span>
            </div>
        </div>
    )
}

export  default ParameterSwitch