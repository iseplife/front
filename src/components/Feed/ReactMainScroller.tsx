import { useRef, useEffect, useCallback, useState } from "react"
import { ListOnScrollProps, VariableSizeList, VariableSizeListProps } from "react-window"

const documentScrollPositionKey = {
    y: "scrollTop",
    x: "scrollLeft"
}

const getScrollPosition = (axis: "x" | "y") =>
    (document.getElementById("main") as HTMLDivElement)[documentScrollPositionKey[axis] as "scrollTop" | "scrollLeft"]

export const ReactMainScroller: React.FC<VariableSizeListProps & {passRef: (ele: VariableSizeList) => void}> = (props) => {
    const main = document.getElementById("main") as HTMLDivElement
    const outerRef = useRef<HTMLDivElement>(null)
    const [ref, setRef] = useState<VariableSizeList>()

    useEffect(() => {
        const handleWindowScroll = () =>
            ref?.scrollTo(main.scrollTop)

        main?.addEventListener("scroll", handleWindowScroll)
        return () => {
            main?.removeEventListener("scroll", handleWindowScroll)
        }
    }, [ref, main])

    const onScroll = useCallback(({ scrollOffset, scrollUpdateWasRequested }: ListOnScrollProps) => {
        if (!scrollUpdateWasRequested) return
        const top = getScrollPosition("y")
        const { offsetTop = 0 } = outerRef.current || {}

        scrollOffset += Math.min(top, offsetTop)

        if (scrollOffset !== top) main.scrollTo(0, scrollOffset)
    }, [main])

    return <VariableSizeList
        {...props}
        style={{
            height: "calc(100% + 100px)",
        }}
        className="overflow-y-hidden"
        ref={_ref => {setRef(_ref!);props.passRef?.(_ref!)}}
        outerRef={outerRef}
        onScroll={onScroll}
    /> 
}