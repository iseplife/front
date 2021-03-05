import React, {forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useState} from "react"
import Loading from "./Loading"
import {useTranslation} from "react-i18next"

const INITIAL_LOADER: Loader = {loading: false, fetch: false, count: 0, over: false}
type Loader = {
    count: number,
    over: boolean,
    loading: boolean
    fetch: boolean
}

export type loaderCallback = (count: number, ...param: any) => Promise<boolean>
export type ScrollerCallback = loaderCallback | [loaderCallback, loaderCallback]

export type InfiniteScrollerRef = {
    resetData: () => void
}

type InfiniteScrollerProps = {
    watch: "UP" | "DOWN" | "BOTH"
    triggerDistance?: number
    callback: ScrollerCallback
    empty?: boolean
    className?: string
    children: ReactNode
    loadingComponent?: React.ReactNode,
}

const InfiniteScroller = forwardRef<InfiniteScrollerRef, InfiniteScrollerProps>(({watch, empty = false,  callback, triggerDistance = 50, loadingComponent, children, className}, ref) => {
    const {t} = useTranslation("common")
    const [upCallback, downCallback] = useMemo(() => (Array.isArray(callback) ? callback : [callback, callback]), [callback])
    const [upLoader, setUpLoader] = useState<Loader>(INITIAL_LOADER)
    const [downLoader, setDownLoader] = useState<Loader>(INITIAL_LOADER)

    const initialLoad = useCallback(() => {
        switch (watch) {
            case "UP":
                setUpLoader(prevState => ({...prevState, loading: true}))
                upCallback(0).then(over => {
                    setUpLoader({
                        over,
                        fetch: false,
                        count: 1,
                        loading: false
                    })
                })
                break
            case "DOWN":
                setDownLoader(prevState => ({...prevState, loading: true}))
                downCallback(0).then(over => {
                    setDownLoader({
                        over,
                        fetch: false,
                        count: 1,
                        loading: false
                    })
                })
                break
        }
    }, [downCallback, upCallback, watch])

    useImperativeHandle(ref, () => ({
        resetData() {
            initialLoad()
        }
    }))

    /**
     * Initial data, call on component creation
     * first element that are going to be displayed
     */
    useEffect(() => {
        initialLoad()
    }, [initialLoad])

    /**
     * Init listener on scroller according on which way we're listening,
     * remove listener on unmount
     */
    useEffect(() => {
        function scrollerListener(this: HTMLElement) {
            // Trigger event loader when top of page is almost reached
            if (watch !== "DOWN" && this.scrollTop <= triggerDistance) {
                setUpLoader(prevState => ({...prevState, fetch: true}))
            }
            // Trigger event loader when bottom of page is almost reached
            if (watch !== "UP" && this.clientHeight + this.scrollTop >= this.scrollHeight - triggerDistance) {
                setDownLoader(prevState => ({...prevState, fetch: true}))
            }
        }

        const main = document.getElementById("main")
        main?.addEventListener("scroll", scrollerListener)


        return () => {
            main?.removeEventListener("scroll", scrollerListener)
        }
    }, [triggerDistance, watch])

    useEffect(() => {
        if (!upLoader.over && !upLoader.loading && upLoader.fetch) {
            setUpLoader(prevState => ({...prevState, loading: true}))
            const f = Array.isArray(callback) ? callback[0] : callback
            f(upLoader.count).then(over => {
                setUpLoader(prevState => ({
                    over,
                    fetch: false,
                    count: ++prevState.count,
                    loading: false
                }))
            })
        }
    }, [upLoader, callback])

    useEffect(() => {
        if (!downLoader.over && !downLoader.loading && downLoader.fetch) {
            setDownLoader(prevState => ({...prevState, loading: true}))
            const f = Array.isArray(callback) ? callback[1] : callback
            f(downLoader.count).then(over => {
                setDownLoader(prevState => ({
                    over,
                    fetch: false,
                    count: ++prevState.count,
                    loading: false
                }))
            })
        }
    }, [downLoader, callback])

    return (
        <div className="relative h-auto">
            {(watch !== "DOWN") && (
                <div className="h-12 mb-3 text-center">
                    {upLoader.over && !empty ? <p>{t("end")}</p> : upLoader.loading && (loadingComponent || <Loading size="3x"/>)}
                </div>
            )}

            <div className={className}>
                {children}
            </div>

            {(watch !== "UP") && (
                <div className="h-12 mb-3 text-center">
                    {downLoader.over && !empty ? <p>{t("end")}</p> : downLoader.loading && (loadingComponent || <Loading size="3x"/>)}
                </div>
            )}
        </div>
    )

})
InfiniteScroller.displayName = "InfiniteScroller"
InfiniteScroller.defaultProps = {
    className: ""
}
export default InfiniteScroller