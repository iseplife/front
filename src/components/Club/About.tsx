import React from "react";
import {Club} from "../../data/club/types";
import {IconFA} from "../Common/IconFA";
import {Skeleton} from "antd";

interface AboutProps {
    club?: Club
    isLoading: boolean
}

const About: React.FC<AboutProps> = ({club, isLoading}) => (
    <div className="w-full">
        {club && !isLoading ? (
            <ul>
                <li className={"flex flex-row items-center mb-4 " + (!club.description && "hidden")}>
                    <IconFA name="fa-info-circle" type="solid" size="2x" className="mr-2 w-12 text-purple-500"/>
                    <div className="w-full text-justify">{club.description}</div>
                </li>
                {club.website &&
                <li className="mb-4">
                    <a href={club.facebook} className="flex flex-row items-center">
                        <IconFA name="fa-firefox-browser" type="brands" size="2x" className="mr-2 w-12 text-orange-400"/>
                        <div className="w-full text-justify">{club.website}</div>
                    </a>
                </li>
                }
                {club.facebook &&
                <li className="mb-4">
                    <a href={club.facebook} className="flex flex-row items-center">
                        <IconFA name="fa-facebook-square" type="brands" size="2x" className="mr-2 w-12 text-indigo-500"/>
                        <div className="w-full text-justify">{club.facebook}</div>
                    </a>
                </li>
                }
                {club.snapchat &&
                    <li className="mb-4">
                        <a href={club.snapchat} className="flex flex-row items-center">
                            <IconFA name="fa-snapchat-square" type="brands" size="2x" className="mr-2 w-12 text-yellow-500"/>
                            <div className="w-full text-justify">{club.snapchat}</div>
                        </a>
                    </li>
                }
                {club.instagram &&
                    <li className="mb-4">
                        <a className="flex flex-row items-center" href={club.instagram}>
                            <IconFA name="fa-instagram-square" type="brands" size="2x" className="mr-2 w-12 text-red-500"/>
                            <div className="w-full text-justify">{club.instagram}</div>
                        </a>
                    </li>
                }
            </ul>
        ) : (
            <ul>
                <li className="mb-4">
                    <div className="flex flex-row items-center">
                        <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                    </div>
                </li>
                <li className="mb-4">
                    <div className="flex flex-row items-center">
                        <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                    </div>
                </li>
                <li className="mb-4">
                    <div className="flex flex-row items-center">
                        <Skeleton active title avatar={{shape: "circle"}} paragraph={false}/>
                    </div>
                </li>
            </ul>
        )}
    </div>
);

export default About;