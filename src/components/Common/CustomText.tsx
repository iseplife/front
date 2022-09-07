import React, { useCallback, useMemo, useState } from "react"
import { Divider } from "antd"
import { useTranslation } from "react-i18next"
import Linkify from "react-linkify"
import { Link } from "react-router-dom"
import { appUrl } from "../../data/http"

interface CustomTextProps {
    description: string
    descLengthThrottle?: number
    disableSpacers?: boolean
    disableLinks?: boolean
}

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
                const currentUrl = new URL(text.startsWith("http://") || text.startsWith("https://") ? text : `http://${text}`)
                const related = currentUrl.host == appUrl.host
                return (
                    <Link
                        to={{pathname: related ? currentUrl.pathname : text}}
                        target={related ? "_self" : "_blank"}
                        key={key}
                    >
                        {text.length > 31 ? text.substring(0, 31)+"..." : text}
                    </Link>
                )
            }
    , [disableLinks])

    let totalLength = 0
    return (
        <span className="break-words w-full">
            <Linkify componentDecorator={componentDecorator}>
                {
                    description?.split("\n").map((val, index, array) => {
                        if (totalLength >= descLengthThrottle && totalLength) return

                        if (val == "<spacer>")
                            return disableSpacers ? undefined : <Divider key={index} className="my-4" />

                        if (!seeAll && descLengthThrottle) {
                            if (totalLength + val.length > descLengthThrottle)
                                val = val.substring(0, descLengthThrottle - totalLength)
                            totalLength += val.length
                        }

                        return index && array[index - 1] != "<spacer>" ?
                            <span key={index}>
                                <br /> {val}
                            </span> :
                            <span key={index}>{val}</span>
                    })
                }
            </Linkify>
            {tooLong && !seeAll && !!descLengthThrottle &&
                <label className="ml-1 font-semibold hover:underline cursor-pointer text-gray-500" onClick={toggleSeeAll}>
                    { t("see_more") }
                </label>
            }
        </span>
    )
}

export default CustomText
