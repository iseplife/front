import { Divider } from "antd"
import { useCallback, useState } from "react"
import { useTranslation } from "react-i18next"

interface CustomTextProps {
    description: string
    descLengthThrottle?: number
    disableSpacers?: boolean
}
const CustomText: React.FC<CustomTextProps> = ({description, descLengthThrottle = 0, disableSpacers}) => {
    const [seeAll, setSeeAll] = useState(false)

    const toggleSeeAll = useCallback(() => setSeeAll(see => !see), [])
    const tooLong = (description?.length ?? 0) > descLengthThrottle

    const { t } = useTranslation()

    let totalLength = 0
    return <span>
        {
            description?.split("\n").map((val, index, array) => {
                if (totalLength >= descLengthThrottle && totalLength) return
        
                if (val == "<spacer>")
                    return disableSpacers ? undefined : <Divider className="my-4" />
                
                if (!seeAll && descLengthThrottle) {
                    if (totalLength + val.length > descLengthThrottle)
                        val = val.substring(0, descLengthThrottle - totalLength)
                    totalLength += val.length
                }
        
                return index && array[index - 1] != "<spacer>" ? <><br /> {val}</> : val
            })
        }
        {tooLong && !seeAll && !!descLengthThrottle &&
            <label className="ml-1 font-semibold hover:underline cursor-pointer text-gray-500" onClick={toggleSeeAll}>
                { t("see_more") }
            </label>
        }
    </span>
}

export default CustomText