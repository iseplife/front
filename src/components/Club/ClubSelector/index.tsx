import { useCallback, useContext, useMemo } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { useTranslation } from "react-i18next"
import { AvatarSizes } from "../../../constants/MediaSizes"
import { AppContext } from "../../../context/app/context"
import { Author } from "../../../data/request.type"
import { mediaPath } from "../../../util"
import DropdownPanel from "../../Common/DropdownPanel"
import { WebPAvatarPolyfill } from "../../Common/WebPPolyfill"

interface ClubSelectorProps {
    className?: string
}

const ClubSelector: React.FC<ClubSelectorProps> = ({className}) => {
    const {t} = useTranslation("event")
    const {state: {authors}} = useContext(AppContext)
    const {register, setValue} = useFormContext()

    const club = useWatch({
        name: "club",
    }) as number
    register("club", {required: true})

    const clubEntity = useMemo(() => authors.find(author => author.id == club), [club, authors])

    const selectAuthorFactory = useCallback((author: Author) => () => setValue("club", author.id), [])

    return (
        <DropdownPanel
            closeOnClick
            buttonClassName={`relative ${className} grid`}
            panelClassName="absolute top-[unset] -bottom-1.5 z-[9999] translate-y-full right-0 w-[200%] max-w-[200px] max-h-[50vh] overflow-y-auto scrollbar-thin bg-white rounded-lg shadow-xl border border-neutral-200"
            clickable
            icon={
                <div className={`relative rounded-lg border border-neutral-200 px-3 ${clubEntity ? "py-[11px]" : "py-3"} cursor-pointer text-neutral-400 text-start`}>
                    {
                        clubEntity ? <div className="flex items-center">
                            <WebPAvatarPolyfill src={mediaPath(clubEntity.thumbnail, AvatarSizes.THUMBNAIL)} className="flex-shrink-0 w-6 h-6" />
                            <div className="ml-3 w-full line-clamp-1 text-ellipsis overflow-hidden text-indigo-400">{clubEntity.name}</div>
                        </div> : <>{t("form.placeholder.club")}</>
                    }
                </div>
            }
        >
            <>
                { authors.map(author =>
                    <div key={author.feedId} onClick={selectAuthorFactory(author)} className="flex items-center rounded-lg hover:bg-neutral-100 p-2 px-3 cursor-pointer">
                        <WebPAvatarPolyfill src={mediaPath(author.thumbnail, AvatarSizes.THUMBNAIL)} className="flex-shrink-0" />
                        <div className="ml-3 overflow-hidden text-ellipsis line-clamp-1 text-indigo-400">{author.name}</div>
                    </div>
                )}
            </>
        </DropdownPanel>
    )
}

export default ClubSelector
