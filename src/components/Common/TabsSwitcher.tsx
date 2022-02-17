import React, {useContext, useMemo} from "react"
import {ClubContext} from "../../context/club/context"

interface TabSwitcherProps {
    currentTab: number,
    setCurrentTab: (tab: number) => () => void,
    tabs: { [key: string]: React.ReactElement },
    className?: string,
}

const TabsSwitcher: React.FC<TabSwitcherProps> = ({currentTab, setCurrentTab, tabs, className}) => {
    const tabsEntries = useMemo(() => Object.entries(tabs), [tabs])
    return (
        <div style={{ flex: "2 1 0%" }} className={`mx-4 md:mx-10 ${className} w-full`}>
            <div className="flex font-semibold text-neutral-600 mt-3 overflow-auto">
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

            { tabsEntries[currentTab][1] }
        </div>
    )
}
export default TabsSwitcher
