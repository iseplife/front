import React from "react";
import {Club} from "../../../../data/club/type";
import {IconFA} from "../../../Common/IconFA";
import {Skeleton} from "antd";

interface AboutProps { club: Club | undefined; isLoading: boolean }
const About: React.FC<AboutProps> = ({club, isLoading}) => {

    return (
        <div className="w-full">
            {
                !!club && !isLoading
                    ? (
                        <ul>
                            <li className={"flex flex-row items-center mb-4 " + (!club.description && "hidden")}>
                                <IconFA name="fa-info-circle" type="solid" size="2x"className="mr-2 w-12 text-purple-500"/>
                                <div className="w-full text-justify">{club.description}</div>
                            </li>
                            <li className={"mb-4 " + (!club.website && "hidden")}>
                                <a href={!!club.facebook ? club.facebook : ""} className="flex flex-row items-center">
                                    <IconFA name="fa-firefox-browser" type="brands" size="2x" className="mr-2 w-12 text-orange-400"/>
                                    <div className="w-full text-justify">{club.website}</div>
                                </a>
                            </li>
                            <li className={"mb-4" + (!club.facebook && "hidden")}>
                                <a href={!!club.facebook ? club.facebook : ""} className="flex flex-row items-center">
                                    <IconFA name="fa-facebook-square" type="brands" size="2x" className="mr-2 w-12 text-indigo-500"/>
                                    <div className="w-full text-justify">{club.facebook}</div>
                                </a>
                            </li>
                            <li className={"mb-4 " + (!club.snapchat && "hidden")}>
                                <a href={!!club.snapchat ? club.snapchat : ""} className="flex flex-row items-center">
                                    <IconFA name="fa-snapchat-square" type="brands" size="2x" className="mr-2 w-12 text-yellow-500"/>
                                    <div className="w-full text-justify">{club.snapchat}</div>
                                </a>
                            </li>
                            <li className={"mb-4 " + (!club.instagram && "hidden")}>
                                <a className="flex flex-row items-center" href={!!club.instagram ? club.instagram : ""}>
                                    <IconFA name="fa-instagram-square" type="brands" size="2x"className="mr-2 w-12 text-red-500" />
                                    <div className="w-full text-justify">{club.instagram}</div>
                                </a>
                            </li>
                        </ul>
                    )
                    : (
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
                    )
            }
        </div>
    )
};

export default About;