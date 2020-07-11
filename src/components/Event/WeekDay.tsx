import {isToday} from "date-fns"
import React from "react"
import {TFunction} from "i18next"

type WeekDayProps = {
    date: Date,
    t: TFunction
}
const WeekDay: React.FC<WeekDayProps> = ({date, t}) => (
	<div className="text-center md:w-32">
		<div className="md:block flex items-end">
			<div
				className="lowercase leading-none md:text-gray-600 text-gray-400 text-4xl order-2">
				{t(`date:day_names.${date.getDay()}`)}
			</div>
			<div
				className={`text-6xl leading-none order-first ${isToday(date) ? "text-yellow-500" : "text-gray-400"}`}>
				{date.getDate()}
			</div>
		</div>
		{isToday(date) &&
        <div
        	className="md:block hidden my-2 text-gray-500 leading-none border-t border-gray-300">
            Today
        </div>
		}
	</div>
)

export default WeekDay