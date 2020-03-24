import React, {useEffect, useState} from "react";
import {useParams, useHistory} from "react-router-dom"
import {getClubsForStudent, getStudentById} from "../../data/student";
import {Avatar, Divider, Drawer, Tooltip} from "antd";
import {useTranslation} from "react-i18next";
import {Utils} from "../Common/Utils";
import {Student} from "../../data/student/types";
import {IconFA} from "../Common/IconFA";
import {HorizontalSpacer} from "../Common/HorizontalSpacer";

const MOBILE_WIDTH = 640;

type UserDrawerProps = {
    backgroundComponent: any,
}

const UserDrawer: React.FC<UserDrawerProps> = ({backgroundComponent}) => {
    const {user_id} = useParams();
    const history = useHistory();
    let key = 0;
    const {t} = useTranslation();
    const [student, setStudent] = useState<Student>({} as Student);
    const [drawerVisibility, setDrawerVisibility] = useState<boolean>(true);
    const [studentClubs, setStudentClubs] = useState<any[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(true);

    const [isMobile] = useState<boolean>(window.innerWidth <= MOBILE_WIDTH);

    const isEmpty = (params: any) => {
        return Array.isArray(params) && params.length === 0 ? true : params === null || params === "";
    };
    const socialUserIcon = (type: string, profile: string | undefined) => {
        const urlType = type.substr(3);
        if (urlType === "snapchat") {
            profile = "add/" + profile;
        }
        return (
            <Tooltip title={urlType} placement="bottom">
                <a href={`https://${urlType}.com/${profile}`} target="_blank"
                   rel="noopener noreferrer"
                   className="mx-2 text-indigo-500">
                    <IconFA type="brands" name={type} className="text-2xl sm:text-4xl"/>
                </a>
            </Tooltip>
        );
    };

    useEffect(() => {
        if (!!user_id) {
            setIsLoading(true);
            getStudentById(parseInt(user_id)).then(res => {
                setStudent(res.data);
            }).catch().finally(() => setIsLoading(false));

            getClubsForStudent(parseInt(user_id)).then(res => {
                setStudentClubs(res.data);
            });

        } else {
            window.location.href = "/404";
        }
    }, []);


    function closeDrawer() {
        setDrawerVisibility(false);
        // window.location.href = "/discovery";
        history.push('/discovery')
    }

    return (
        <div>
            {backgroundComponent}
            {!isLoading
                ? <Drawer placement={isMobile ? "bottom" : "right"} height={400}
                          closable={false} width={500}
                          onClose={() => closeDrawer()} visible={drawerVisibility}>
                    <div className="flex justify-start items-center sm:items-start">
                        <Avatar src={!!student ? student.photoUrl : ""}
                                alt={student.firstName + " " + student.lastName}
                                className={"w-32 h-32 xl:w-48 xl:h-48 flex-none text-3xl sm:text-6xl " + Utils.randomBackgroundColors()}>
                            <div
                                className="w-32 h-32 xl:w-48 xl:h-48 flex items-center justify-center">{Utils.getInitials(student)}</div>
                        </Avatar>
                        <div className="ml-3 mt-2 text-base">
                            <div
                                className="text-indigo-500 text-center font-bold text-sm sm:text-2xl mx-auto">
                                {student.firstName + " " + student.lastName.toUpperCase()}
                            </div>
                            <HorizontalSpacer/>
                            <div className="text-sm sm:text-base">
                                Promo <span className="select-all">{student.promo}</span>, n°<span
                                className="select-all">{student.id}</span>
                            </div>
                            <div className="text-sm sm:text-base">
                                {!isEmpty(student.mail) ? <span
                                    className="select-all">{student.mail}</span> : t('user:no-mail')}
                            </div>
                            <div className="text-sm sm:text-base">
                                {!isEmpty(student.phoneNumber) ? <span
                                    className="select-all">{student.phoneNumber}</span> : t('user:no-phone')}
                            </div>
                            <div className="mt-3 sm:mt-10 mx-auto">
                                {isEmpty(student.facebook) ? null : socialUserIcon("fa-facebook", student.facebook)}
                                {isEmpty(student.twitter) ? null : socialUserIcon("fa-twitter", student.twitter)}
                                {isEmpty(student.instagram) ? null : socialUserIcon("fa-instagram", student.instagram)}
                                {isEmpty(student.snapchat) ? null : socialUserIcon("fa-snapchat", student.snapchat)}
                            </div>
                        </div>


                    </div>
                    <Divider/>
                    <div className="pl-2 text-xs sm:text-lg">
                        <div className="font-bold my-1">{t('user:bio')}</div>
                        <div className="px-6 italic">
                            {!isEmpty(student.bio) ? t('user:no-bio') : student.bio}
                        </div>
                        <Divider/>
                        <div className="font-bold my-1">{t('user:clubs')}</div>
                        <div className="flex flex-row flex-wrap">
                            {
                                isEmpty(studentClubs) ? t('user:no-clubs') :
                                    (studentClubs.map(club => {
                                        return (
                                            <Tooltip title={club.club.name} placement="top"
                                                     key={++key}
                                                     className="m-1 shadow-md hover:shadow-outline">
                                                <Avatar src={club.club.logoUrl}
                                                        alt={club.club.name}
                                                        className="w-12 h-12 sm:w-24 sm:h-24"
                                                />
                                            </Tooltip>
                                        );
                                    }))
                            }
                        </div>
                        {/*<Divider/>*/}
                        {/*<div className="font-bold my-1">{t('user:photos')}</div>*/}
                        {/*{isEmpty(studentPictures) ? t('user:no-photos') : null}*/}
                    </div>
                </Drawer>
                : null}
        </div>
    )
};

export default UserDrawer;