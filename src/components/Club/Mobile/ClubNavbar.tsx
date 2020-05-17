import React, {useLayoutEffect, useRef, useState} from "react";
import {Tab, tabs} from "./ClubTab.helper";

interface ClubNavbarProps {
    onActiveTabChange(tab: Tab): void;
}

const ClubNavbar: React.FC<ClubNavbarProps> = ({onActiveTabChange}) => {
    const [navtabs, setNavtabs] = useState<Tab[]>(tabs);
    const [isSticky, setIsSticky] = useState<boolean>(false);

    let navbarRef = useRef<HTMLDivElement>(null);

    useLayoutEffect(() => {
        const element = document.getElementById("main");
        if (element) {
            element.addEventListener("scroll", () => scroll$(element));
        }
    });
    const scroll$ = (element: HTMLElement): void => {
        if (!!navbarRef.current) {
            const elementNav: HTMLDivElement = navbarRef.current;

            const principalNavigationBarHeighInPixel = 48;
            const currentPositionScroll = element.scrollTop;
            const positionNavbarFixed = 322;
            const isNavbarSticky = currentPositionScroll >= (positionNavbarFixed - principalNavigationBarHeighInPixel);
            setIsSticky(isNavbarSticky);

            isNavbarSticky ? elementNav.style.top = "3rem" : elementNav.style.top = `${positionNavbarFixed}`;
        }
    };

    const onTabChange = (tab: Tab): void => {
        onActiveTabChange(tab);
        const newTabs = navtabs.map((navtab: Tab) => {
            tab.id === navtab.id ? navtab.isActive = true : navtab.isActive = false;
            return navtab;
        });
        setNavtabs(newTabs);
    };

    return (
        <div className={"w-full " + (isSticky ? "absolute z-10 " : "")} ref={navbarRef}>
            <ul className="flex border-b bg-white border mb-0 shadow-md xl:overflow-hidden lg:overflow-hidden md:overflow-hidden overflow-x-scroll overflow-y-hidden">
                {
                    navtabs.map((tab: Tab) => (
                        <li className="-mb-px m-auto" key={tab.id}>
                            <a
                                className={"inline-block py-2 px-4 text-gray-700 font-semibold xl:text-lg lg:text-lg " + (tab.isActive ? "border-b-4 border-indigo-500" : "")}
                                onClick={() => onTabChange(tab)}
                                key={tab.id}
                            >
                                {tab.name}
                            </a>
                        </li>
                    ))
                }
            </ul>
        </div>
    );
};

export default ClubNavbar;