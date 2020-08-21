import React, {useCallback, useState} from "react"
import {
    LockOutlined,
    UnlockOutlined,
} from "@ant-design/icons"

type LockerProps = {
    className?: string
    defaultValue?: boolean
    onChange: (v: boolean) => void
}
const Locker: React.FC<LockerProps> = ({defaultValue = true, onChange, className}) => {
    const [value, setValue] = useState(defaultValue)
    const handleClick = useCallback(() => {
        setValue(v => !v)
        onChange(value)
    }, [])

    return (
        <span onClick={handleClick} className={`cursor-pointer ${className}`}>
            {value ? <LockOutlined/> : <UnlockOutlined/>}
        </span>
    )
}

Locker.defaultProps = {
    className: ""
}
export default Locker