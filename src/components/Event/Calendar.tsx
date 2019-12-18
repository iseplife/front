import React, {CSSProperties} from "react";

interface CalendarProps{
    className?: string
    style?: CSSProperties
}

const Calendar: React.FC<CalendarProps> = ({className, style}) => {
    return (
        <div className={`bg-white shadow-md rounded h-64 w-full ${className}`} style={style}>

        </div>
    )
};

export default Calendar