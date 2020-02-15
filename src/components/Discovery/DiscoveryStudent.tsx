import React, {useEffect, useState} from "react";
import {Avatar, Input, Select} from "antd";
import {getAllStudents, searchStudents, Student} from "../../data/student";
import {useTranslation} from "react-i18next";
import {HorizontalSpacer, MOBILE_WIDTH} from "../../pages/discovery";
import {Utils} from "../Common/Utils";
import InfiniteScroller, {loaderCallback} from "../Common/InfiniteScroller";

const {Option} = Select;

const DiscoveryStudent: React.FC = () => {
    let key = 0;
    const {t} = useTranslation('discovery');
    const [sortOrder, setSortOrder] = useState(true);
    const [students, setStudents] = useState<Student[]>([]);
    const [promos, setPromos] = useState<number[]>([]);
    const [selectedPromos, setSelectedPromos] = useState<string[]>([]);

    // const [sortPromo, setSortPromo] = useState([]);
    const [isMobile, setIsMobile] = useState<boolean>(window.innerWidth <= MOBILE_WIDTH);
    const handleWindowSizeChange = () => {
        setIsMobile(window.innerWidth <= 500);
    };
    useEffect(() => {
        window.addEventListener('resize', handleWindowSizeChange);
        return () => window.removeEventListener('resize', handleWindowSizeChange);
    });

    const sortStudents = (ascending: any) => {
        let compNumberAsc = 1;
        let compNumberDesc = -1;
        if (!ascending) {
            compNumberAsc = -1;
            compNumberDesc = 1
        }
        students.sort(function (studentA, studentB) {
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
        getAllStudents(0).then(res => {
            setStudents(res.data.content);
        });
    };
    useEffect(() => initStudents(), []);
    const initPromos = () => {
        const promos = Array.from(new Set(students.map((student: Student) => student.promo))).sort((a, b) => b - a);
        setPromos(promos);
    };
    useEffect(() => initPromos(), [students]);

    // Sort by firstname / lastname
    const handleSearchStudent = (event: any) => {
        searchStudents(event.target.value, "").then(res => {
            console.log(res.data);
        });
        /*console.log(students.filter((student: Student) => {
            return (student.firstName === event.target.value) ? student.firstName : "";
        }));*/
    };

    // Sort by promos
    const handlePromoSelect = (selectedItems: any) => {
        setSelectedPromos(selectedItems);
    };
    useEffect(() => {
        searchStudents("", selectedPromos.toString()).then(res => {
            setStudents(prevState => [...prevState, ...res.data]);
        });
    }, [selectedPromos]);


    // Sort by lastname ASC/DESC
    const handleSortSelect = () => {
        setSortOrder(!sortOrder);
    };

    const showDrawer = (studentId: number) => {
        window.location.replace(`discovery/student/${studentId}`);
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
            <Avatar src={props.student.photoUrl} size={isMobile ? 120 : 200}
                    alt={props.student.firstName + props.student.lastName}
                    className={"shadow-xl hover:shadow-outline text-3xl sm:text-6xl " + Utils.randomBackgroundColors()}>
                {Utils.getInitials(props.student)}
            </Avatar>
            <p className="font-bold sm:text-xl">{props.student.firstName + " " + props.student.lastName.toUpperCase()}<br/>
                <span
                    className="italic text-xs sm:text-sm">{'Promo ' + props.student.promo}</span>
            </p>
        </div>
    );

    sortStudents(sortOrder);
    return (
        <div className="container mx-auto text-center mt-10 mb-20">
            <div
                className="font-bold text-indigo-500 py-3 text-4xl">
                {t('students')}
            </div>
            <HorizontalSpacer spacing={6}/>
            {/* Search and filters */}
            <div className="flex flex-wrap sm:flex-no-wrap sm:justify-between">
                <Input placeholder={t('placeholder-search')}
                       className="text-center text-sm sm:text-lg rounded-full w-11/12 sm:w-full mx-auto sm:mx-0"
                       onChange={handleSearchStudent}/>
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
            <InfiniteScroller watch="DOWN" callback={getNextStudents} triggerDistance={80}/>
            <div className="flex flex-wrap justify-start">
                {
                    students.map(item => (<CustomAvatar key={key++} student={item}/>))
                }
            </div>
        </div>
    );
};

export default DiscoveryStudent;