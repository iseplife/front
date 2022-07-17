import React, {useMemo} from "react"

interface TabSwitcherProps {
    currentTab: number,
    setCurrentTab: (tab: number) => () => void,
    tabs: { [key: string]: React.ReactElement },
    className?: string,
}

const TabsSwitcher: React.FC<TabSwitcherProps> = ({currentTab, setCurrentTab, tabs, className}) => {
    const tabsEntries = useMemo(() => Object.entries(tabs), [tabs])
    return (
        <div className={`mx-4 md:mx-10 ${className} relative`}>
            <div className="w-full max-w-full overflow-x-auto absolute scrollbar-thin">
                <div className="flex font-semibold text-neutral-600">
                    {tabsEntries.map(([tabName], index) => {
                        const splitted = tabName.split(":")
                        let type = splitted[0]
                        if (splitted.length > 1)
                            tabName = splitted[1]
                        else
                            type = undefined!
                        return <>
                            <div
                                key={index}
                                onClick={setCurrentTab(index)}
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
            { tabsEntries[currentTab][1] }
        </div>
    )
}
export default TabsSwitcher
