import React, {useEffect, useState} from "react";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import {getAllPromo, getAllStudents} from "../../data/student";
import {Student} from "../../data/student/types";
import {useTranslation} from "react-i18next";
import {Utils} from "../Common/Utils";
import {Avatar, Input, Select} from "antd";
import {HorizontalSpacer} from "../../pages/discovery";

const {Option} = Select;

const getStudentAvatarSize = () => {
    if (window.innerWidth <= 640) {
        return 120
    } else if (window.innerWidth <= 768) {
        return 146;
    } else if (window.innerWidth <= 1024) {
        return 173;
    } else if (window.innerWidth <= 1280) {
        return 200;
    }
    return 200;
};

const DiscoveryStudent: React.FC = () => {
    let key = 0;
    const {t} = useTranslation('discovery');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [promos, setPromos] = useState<number[]>([]);
    const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
    const [sortOrder, setSortOrder] = useState<boolean>(true);

    const sortStudents = (ascending: any) => {
        let compNumberAsc = 1;
        let compNumberDesc = -1;
        if (!ascending) {
            compNumberAsc = -1;
            compNumberDesc = 1
        }
        students.sort((studentA, studentB) => {
            let comparison = 0;
            if (studentA.lastName > studentB.lastName) {
                comparison = compNumberAsc;
            } else if (studentA.lastName < studentB.lastName) {
                comparison = compNumberDesc;
            }
            return comparison;
        });
    };

    // Init
    const initStudents = () => {
        setIsLoading(true);
        getAllStudents(0).then(res => {
            setStudents(res.data.content);
        }).catch().finally(() => setIsLoading(false));
    };
    const initPromos = () => {
        getAllPromo().then(res => {
            setPromos(res.data);
        });
    };

    // Sort by promos
    const handlePromoSelect = (selectedItems: any) => {
        setSelectedPromos(selectedItems);
    };
    const handleSortSelect = () => {
        setSortOrder(!sortOrder);
    };

    useEffect(() => initStudents(), []);
    useEffect(() => initPromos(), [students]);
    useEffect(() => sortStudents(sortOrder), [sortOrder]);

    const showDrawer = (studentId: number) => {
        window.history.pushState({}, "Student", `discovery/student/${studentId}`);
    };

    // Infinite Scroller next students
    const getNextStudents: loaderCallback = async (pageCount: number) => {
        const res = await getAllStudents(pageCount);
        if (pageCount !== 0) {
            setStudents(prevState => ([...prevState, ...res.data.content]));
        }
        return res.data.last;
    };

    /**
     * Custom component for Students avatar
     * @param props
     * @constructor
     */
    const CustomAvatar = (props: any) => (
        <div className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-3/12 xl:w-1/5 text-center cursor-pointer"
             onClick={() => showDrawer(props.student.id)}>
            <Avatar src={props.student.photoUrl} size={getStudentAvatarSize()}
                    alt={props.student.firstName + props.student.lastName}
                    className={"shadow-xl hover:shadow-outline text-3xl sm:text-5xl " +
                    "md:text-5xl xl:text-6xl " + Utils.randomBackgroundColors()}>
                {Utils.getInitials(props.student)}
            </Avatar>
            <p className="font-bold sm:text-xl">{props.student.firstName + " " + props.student.lastName.toUpperCase()}<br/>
                <span
                    className="italic text-xs sm:text-sm">{'Promo ' + props.student.promo}</span>
            </p>
        </div>
    );

    return (
        <div className="container mx-auto text-center mt-10 mb-20">
            <div className="font-bold text-indigo-500 py-3 text-4xl">
                {t('students')}
            </div>
            <HorizontalSpacer spacing={6}/>
            {/* Search and filters */}
            <div className="flex flex-wrap sm:flex-no-wrap sm:justify-between">
                {/* Todo: replace with searchBar */}
                <Input placeholder={t('placeholder-search')} disabled={true}
                       className="text-center text-sm sm:text-lg rounded-full w-11/12 sm:w-full mx-auto sm:mx-0"/>
                <div
                    className="flex justify-end w-full my-2 sm:my-0 sm:w-1/3 mr-0 sm:mr-3 md:mr-5 lg:mr-6 xl:mr-10">
                    <Select mode="multiple" className="w-1/2 sm:w-40 mx-2"
                            placeholder={t('promotions')} onChange={handlePromoSelect}
                            value={selectedPromos}>
                        {
                            promos.filter((option: any) => !selectedPromos.includes(option)).map((promo: any) => (
                                <Option key={promo} value={promo}>{'Promo ' + promo}</Option>
                            ))
                        }
                    </Select>
                    <Select defaultValue="true" className="mx-2 w-1/2 sm:w-24"
                            onSelect={handleSortSelect}>
                        <Option value="true">Az</Option>
                        <Option value="false">Za</Option>
                    </Select>
                </div>
            </div>

            <HorizontalSpacer spacing={8}/>
            {/* List of students */}
            {/*<InfiniteScroller watch="DOWN" callback={getNextStudents}>*/}
            <div className="flex flex-wrap justify-start">
                {!isLoading
                    ? students.map(student => (<CustomAvatar key={key++} student={student}/>))
                    : null
                }
            </div>
            {/*</InfiniteScroller>*/}
        </div>
    );
};

export default DiscoveryStudent;