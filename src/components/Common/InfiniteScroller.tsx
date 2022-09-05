import React, {forwardRef, ReactNode, useCallback, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react"
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
    loaderClassName?: string
    children: ReactNode
    loadingComponent?: React.ReactNode,
    scrollElement?: HTMLElement | null | false,
    block?: boolean
}

const InfiniteScroller = forwardRef<InfiniteScrollerRef, InfiniteScrollerProps>((props, ref) => {
    const {t} = useTranslation("common")
    const {watch, block = false, empty = false,  callback, triggerDistance = 200, loadingComponent, loaderClassName, children, className} = props
    const [upCallback, downCallback] = useMemo(() => (Array.isArray(callback) ? callback : [callback, callback]), [callback])
    const [upLoader, setUpLoader] = useState<Loader>(INITIAL_LOADER)
    const [downLoader, setDownLoader] = useState<Loader>(INITIAL_LOADER)

    const intersector = useRef<IntersectionObserver>(undefined!)

    const loaderRef = useRef<HTMLDivElement>(null)

    const blockRef = useRef(block)
    
    useEffect(() => {
        blockRef.current = block
    }, [block])

    useEffect(() => {
        intersector.current?.disconnect()
        if (!block){
            intersector.current = new IntersectionObserver(
                () => {
                    if (watch !== "DOWN")
                        setUpLoader(prevState => (prevState.loading ? prevState : {...prevState, fetch: true}))
                    if (watch !== "UP")
                        setDownLoader(prevState => (prevState.loading ? prevState : {...prevState, fetch: true}))
                }, {
                    threshold: 0,
                    rootMargin: `${triggerDistance * 1.3}px`,
                    root: document.getElementById("main")
                }
            )
            if(loaderRef?.current)
                intersector?.current.observe(loaderRef.current)
        }
    }, [block, watch])

    useEffect(() => () => {intersector.current?.disconnect(); intersector.current = undefined!}, [])// Turn off intersector on unload

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

                requestAnimationFrame(() => 
                    setTimeout(() => {
                        if((loaderRef?.current?.getBoundingClientRect().top ?? 0) > 0 && !block)
                            setUpLoader(prevState => ({...prevState, fetch: true}))
                    }, 100)
                )
            })
        }
    }, [upLoader, callback, loaderRef?.current, block])

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
                requestAnimationFrame(() => 
                    setTimeout(() => {
                        if((loaderRef?.current?.getBoundingClientRect().top ?? Number.MAX_VALUE) < window.innerHeight && !block)
                            setDownLoader(prevState => ({...prevState, fetch: true}))
                    }, 100)
                )
            })
        }
    }, [downLoader, callback, loaderRef?.current, block])

    useEffect(() => {
        const int = setInterval(() => {
            if((loaderRef?.current?.getBoundingClientRect().top ?? Number.MAX_VALUE) < window.innerHeight && !blockRef.current)
                setDownLoader(prevState => !prevState.fetch ? ({...prevState, fetch: true}) : prevState)
        }, 1000)

        return () => clearInterval(int)
    }, [])

    return (
        <div className={`relative h-auto ${className}`}>
            {(watch !== "DOWN") && !empty && (
                <div className="mb-3 text-center">
                    { upLoader.over ?
                        <p>{t("end")}</p> :
                        upLoader.loading && (loadingComponent || <Loading size="3x"/>)}
                </div>
            )}

            {children}

            <div className={`invisible absolute mt-5 ${loaderClassName}`} ref={loaderRef} />

            {(watch !== "UP") && !empty && (
                <div className="mb-3 text-center">
                    { downLoader.over ?
                        <p>{t("end")}</p>:
                        (loadingComponent || <Loading size="3x"/>)
                    }
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