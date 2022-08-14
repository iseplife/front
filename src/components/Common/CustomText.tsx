import { Divider } from "antd"
import { useCallback, useMemo, useState } from "react"
import { useTranslation } from "react-i18next"
import Linkify from "react-linkify"
import { Link } from "react-router-dom"

interface CustomTextProps {
    description: string
    descLengthThrottle?: number
    disableSpacers?: boolean
    disableLinks?: boolean
}

const appUrl = process.env.REACT_APP_URL ?? window.location.origin
const CustomText: React.FC<CustomTextProps> = ({description, descLengthThrottle = 0, disableSpacers, disableLinks}) => {
    const [seeAll, setSeeAll] = useState(false)

    const toggleSeeAll = useCallback(() => setSeeAll(see => !see), [])
    const tooLong = (description?.length ?? 0) > descLengthThrottle

    const { t } = useTranslation()
    const componentDecorator = useMemo(() =>
        disableLinks ?
            () => undefined
            :
            (href: string, text: string, key: number) => {
                const relatedAppUrl = text.startsWith("http") ? appUrl : appUrl.split("://")[1]
                const localLink = text.startsWith(relatedAppUrl)
                return <Link
                    to={{pathname: localLink ? text.replace(relatedAppUrl, "") : href}}
                    target={localLink ? "_self" : "_blank"}
                    key={key}
                >
                    {text.length > 31 ? text.substring(0, 31)+"..." : text}
                </Link>
            }
    , [disableLinks])

    let totalLength = 0
    return <span className="break-words w-full">
        <Linkify componentDecorator={componentDecorator}>
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
        </Linkify>
        {tooLong && !seeAll && !!descLengthThrottle &&
            <label className="ml-1 font-semibold hover:underline cursor-pointer text-gray-500" onClick={toggleSeeAll}>
                { t("see_more") }
            </label>
        }
    </span>
}

export default CustomText