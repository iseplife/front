import React, {useContext, useMemo} from "react"
import {ClubContext} from "../../context/club/context"

interface TabSwitcherProps {
    currentTab: number,
    setCurrentTab: (tab: number) => () => void,
    tabs: {[key: string]: React.ReactElement},
}

const TabsSwitcher: React.FC<TabSwitcherProps> = ({currentTab, setCurrentTab, tabs}) => {
    const tabsEntries = useMemo(() => Object.entries(tabs), [tabs])
    return (
        <>
            <div className="flex font-semibold text-neutral-600 mt-3">
                {tabsEntries.map(([tabName], index) => 
                    <div
                        key={index} 
                        onClick={setCurrentTab(index)}
                        className={"rounded-full bg-black bg-opacity-[8%] hover:bg-opacity-[12%] transition-colors px-3 py-1 cursor-pointer mr-2.5 "+(index == currentTab && "bg-opacity-[15%] hover:bg-opacity-20 text-neutral-700")}
                    >
                        { tabName }
                    </div>
                )}
            </div>

            { tabsEntries[currentTab][1] }
        </>
    )
}
export default TabsSwitcher
