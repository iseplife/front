import React, {useCallback, useEffect, useState} from "react";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";
import {getAllPromo, getAllStudents, searchStudents} from "../../data/student";
import {Student} from "../../data/student/types";
import {useTranslation} from "react-i18next";
import {Utils} from "../Common/Utils";
import {Avatar, Input, Select} from "antd";
import {HorizontalSpacer} from "../../pages/discovery";
import {Link} from "react-router-dom";

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

type SearchItem = {
    id: number,
    type: string,
    name: string,
    thumbURL: string,
    description: string,
    status: boolean
}

const DiscoveryStudent: React.FC = () => {
    const {t} = useTranslation('discovery');
    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [sortOrder, setSortOrder] = useState<boolean>(true);
    const [promos, setPromos] = useState<number[]>([]);
    const [selectedPromos, setSelectedPromos] = useState<string[]>([]);
    const [searching, setSearching] = useState<boolean>(false);

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
        searchStudents("", "", 0).then(res => {
            setStudents(parseStudents(res.data.content));
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

    // TODO: change promos to selectedPromos after i think !
    // Infinite Scroller next students
    const getNextStudents: loaderCallback = useCallback(async (pageCount: number) => {
        const res = await searchStudents("", selectedPromos.toString(), pageCount);
        if (pageCount !== 0) {
            setStudents(prevState => ([...prevState, ...parseStudents(res.data.content)]));
        }
        return res.data.last;
    }, [selectedPromos]);

    useEffect(() => initStudents(), []);
    useEffect(() => initPromos(), []);
    // useEffect(() => sortStudents(sortOrder), [sortOrder]);
    sortStudents(sortOrder);

    useEffect(() => {
        if (selectedPromos.length !== 0) {
            setSearching(true);
            searchStudents("", selectedPromos.toString(), 0).then(res => {
                console.table(res.data.content);
                setStudents(parseStudents(res.data.content));
            });
        } else {
            setSearching(false);
        }
    }, [selectedPromos]);
    useEffect(() => {
        if (!searching) {
            initStudents();
        }
    }, [searching]);

    const parseStudents = (searchItems: SearchItem[]): Student[] => {
        return searchItems.map((s: SearchItem) => (
            {
                id: s.id,
                promo: parseInt(s.description),
                firstName: s.name.split(" ")[0],
                lastName: s.name.split(" ")[1],
                photoUrl: s.thumbURL,
                archived: false,
                rolesValues: [],
                allowNotifications: false
            }
        ));
    };

    /**
     * Custom component for Students avatar
     * @param props
     * @constructor
     */
    const CustomAvatar = (props: any) => (
        <Link
            className="w-1/2 sm:w-1/2 md:w-1/3 lg:w-3/12 xl:w-1/5 text-center cursor-pointer no-underline text-gray-700"
            to={{
                pathname: `/discovery/student/${props.student.id}`
            }}>
            <Avatar src={props.student.photoUrl} /*size={getStudentAvatarSize()}*/
                    alt={props.student.firstName + props.student.lastName}
                    className={"w-32 h-3 2 xl:w-48 xl:h-48 shadow-xl hover:shadow-outline" +
                    " text-3xl" +
                    " sm:text-5xl " +
                    "md:text-5xl xl:text-6xl " + Utils.randomBackgroundColors()}>
                <div
                    className="w-32 h-32 xl:w-48 xl:h-48 flex items-center justify-center">{Utils.getInitials(props.student)}</div>
            </Avatar>
            <p className="font-bold sm:text-xl">{props.student.firstName + " " + props.student.lastName.toUpperCase()}<br/>
                <span
                    className="italic text-xs sm:text-sm">{'Promo ' + props.student.promo}</span>
            </p>
        </Link>
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
            <InfiniteScroller watch="DOWN" callback={getNextStudents} triggerDistance={5}>
                <div className="flex flex-wrap justify-start">
                    {!isLoading
                        ? students.map((student, i) => (<CustomAvatar key={i} student={student}/>))
                        : null
                    }
                </div>
            </InfiniteScroller>
        </div>
    );
};

export default DiscoveryStudent;