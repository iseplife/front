import React, {useEffect, useState} from "react";
import Loading from "../Loading";
import {useTranslation} from "react-i18next";

const INITIAL_LOADER: Loader = {loading: false, count: 0, over: false};
type Loader = {
    count: number,
    over: boolean,
    loading: boolean
}

export type loaderCallback =  (count: number, ...param: any) => Promise<boolean>;

type InfiniteScrollerProps = {
    watch: "UP" | "DOWN" | "BOTH",
    triggerDistance?: number,
    callback: loaderCallback | [loaderCallback, loaderCallback],
    className?: string
}

const InfiniteScroller: React.FC<InfiniteScrollerProps> = ({watch, callback, triggerDistance = 50, children, className = ""}) => {
    const {t} = useTranslation('common');
    const [upLoader, setUpLoader] = useState<Loader>(INITIAL_LOADER);
    const [downLoader, setDownLoader] = useState<Loader>(INITIAL_LOADER);
    useEffect(() => {
        function scrollerListener(this: HTMLElement) {
            // Trigger event loader when top of page is almost reached
            if (watch !== "DOWN" && this.scrollTop <= triggerDistance) {
                setUpLoader(prevState => ({...prevState, loading: true}));
            }
            // Trigger event loader when bottom of page is almost reached
            if (watch !== "UP" && this.clientHeight + this.scrollTop >= this.scrollHeight - triggerDistance) {
                setDownLoader(prevState => ({...prevState, loading: true}));
            }
        }

        const main = document.getElementById("main");
        main?.addEventListener('scroll', scrollerListener);
        return () => {
            main?.removeEventListener("scroll", scrollerListener);
        }
    }, [triggerDistance, watch]);

    useEffect(() => {
        if (!upLoader.over && upLoader.loading) {
            const f = Array.isArray(callback) ? callback[0] : callback;
            f(upLoader.count).then(over => {
                setUpLoader(prevState => ({
                    ...prevState,
                    over,
                    count: ++prevState.count
                }))
            })
        }
    }, [upLoader, callback]);

    useEffect(() => {
        if (!downLoader.over && downLoader.loading) {
            const f = Array.isArray(callback) ? callback[1] : callback;
            f(downLoader.count).then(over => {
                setDownLoader(prevState => ({
                    ...prevState,
                    over,
                    count: ++prevState.count
                }))
            })
        }
    }, [downLoader, callback]);

    return (
        <div className={`relative h-full h-auto ${className}`}>
            {(watch !== "DOWN") && (
                <div className="h-12 mb-3 text-center">
                    {upLoader.over ? <p>{t('end')}</p> : upLoader.loading && <Loading size="3x"/>}
                </div>
            )}

            {children}

            {(watch !== "UP") && (
                <div className="h-12 mb-3 text-center">
                    {downLoader.over ? <p>{t('end')}</p> : downLoader.loading && <Loading size="3x"/>}
                </div>
            )}
        </div>
    );
};

export default InfiniteScroller;