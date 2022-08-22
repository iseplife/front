import React, {useCallback, useEffect, useMemo, useState} from "react"

interface TabSwitcherProps {
    currentTab: number,
    setCurrentTab: (tab: number) => () => void,
    tabs: { [key: string]: React.ReactElement },
    className?: string,
}

const TabsSwitcher: React.FC<TabSwitcherProps> = ({ currentTab: _currentTab, setCurrentTab, tabs, className }) => {
    const [loading, setLoading] = useState(true)
    const [currentTab, setCurrentTabIndex] = useState<number>(history.state?.currentTab ?? _currentTab)
    useEffect(() => {
        setLoading(loading => {
            if (loading)
                setCurrentTab(currentTab)()
            else
                setCurrentTabIndex(_currentTab)
            return false
        })
    }, [_currentTab])


    const tabsEntriesWithCallback: [string, React.ReactElement, () => void][] = useMemo(() => 
        Object.entries(tabs).map(([tabName, tab], index) => [
            tabName,
            tab,
            () => {
                setCurrentTab(index)()
                history.replaceState({currentTab: index}, "")
            }
        ])
    , [tabs, setCurrentTab])

    return (
        <div className={`mx-4 md:mx-10 ${className} relative`}>
            <div className="w-full max-w-full overflow-x-auto absolute scrollbar-thin select-none">
                <div className="flex font-semibold text-neutral-600">
                    {tabsEntriesWithCallback.map(([tabName, tab, callback], index) => {
                        const splitted = tabName.split(":")
                        let type = splitted[0]
                        if (splitted.length > 1)
                            tabName = splitted[1]
                        else
                            type = undefined!
                        return <>
                            <div
                                key={index}
                                onClick={callback}
                                className={
                                    `${type}:hidden rounded-full bg-black bg-opacity-[8%] hover:bg-opacity-[12%] transition-colors px-3 py-1 cursor-pointer mr-2.5 `
                                    + (index == currentTab && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")
                                }
                            >
                                {tabName}
                            </div>
                        </>
                    })}
                </div>
            </div>
            <div className="py-1 mr-2.5 pointer-events-none invisible">
                Tab
            </div>
            { tabsEntriesWithCallback[currentTab]?.[1] }
        </div>
    )
}
export default TabsSwitcher
