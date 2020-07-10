import React, {useMemo} from "react";
import Calendar from 'react-calendar';
import {useTranslation} from "react-i18next";

type SideCalendarProps = {
    date: Date
    handleChange: (d: Date) => void
    className: string
};
const SideCalendar: React.FC<SideCalendarProps> = ({date, handleChange, className}) => {
    const {i18n} = useTranslation("event");



    return (
        <div className={`${className} flex flex-column shadow bg-white`}>
            <Calendar
                className=""
                locale={i18n.language}

                value={date}
                onChange={(d) => handleChange(Array.isArray(d) ? d[0]: d)}
            />
        </div>
    )
};

SideCalendar.defaultProps = {
    className: ""
}
export default SideCalendar;