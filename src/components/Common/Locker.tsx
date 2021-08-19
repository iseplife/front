import React, {useCallback, useState} from "react"
import {faLock, faUnlock} from "@fortawesome/free-solid-svg-icons"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"

//TODO use more this component (and create same one with bell subscription)
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
            {value ? <FontAwesomeIcon icon={faLock} /> : <FontAwesomeIcon icon={faUnlock} />}
        </span>
    )
}

Locker.defaultProps = {
    className: ""
}
export default Locker
