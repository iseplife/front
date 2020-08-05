import React, {useCallback, useEffect, useReducer, useRef, useState} from "react"
import InfiniteScroller, {InfiniteScrollerRef, loaderCallback} from "../Common/InfiniteScroller"
import {searchStudents} from "../../data/student"
import {useTranslation} from "react-i18next"
import {HorizontalSpacer} from "../../pages/discovery"
import StudentCard from "./StudentCard"
import {FilterReducerAction, StudentPreview} from "../../data/student/types"
import {SearchItem} from "../../data/searchbar/types"
import YearBookSearchBar from "./YearBookSearchBar"
import {EntitySet} from "../../util"

export type StudentFilter = {
    promos: number[]
    atoz: boolean
    name: string
}

const DEFAULT_FILTER: StudentFilter = {
    name: "",
    atoz: true,
    promos: []
}
const reducer: React.Reducer<StudentFilter, FilterReducerAction> = (filter, action) => {
    const newFilter = {...filter}
    switch (action.type) {
        case "UPDATE_SEARCH":
            newFilter.name = action.name
            break
        case "ADD_PROMO":
            newFilter.promos.push(action.promo)
            break
        case "REMOVE_PROMO":
            if (newFilter.promos.indexOf(action.promo) > -1)
                newFilter.promos.splice(newFilter.promos.indexOf(action.promo), 1)
            break
        case "TOGGLE_SORT":
            newFilter.atoz = !newFilter.atoz
            break
        case "INIT_FILTER":
            return DEFAULT_FILTER
    }
    return newFilter
}

const parseSearchResults = (results: SearchItem[]): StudentPreview[] => {
    return results.map(r => {
        const [firstName, lastName] = r.name.split(" ")
        return ({
            id: r.id,
            firstName,
            lastName,
            photoUrlThumb: r.thumbURL,
            promo: +r.description || -1
        })
    }
    )
}

const YearBook: React.FC = () => {
    const {t} = useTranslation("discovery")
    const [students, setStudents] = useState<EntitySet<StudentPreview>>(new EntitySet())
    const [filteredStudent, setFilteredStudents] = useState<StudentPreview[]>([])
    const [filter, setFilter] = useReducer(reducer, DEFAULT_FILTER)

    const scrollerRef = useRef<InfiniteScrollerRef>(null)
    const switchSorting = useCallback(() => {
        setStudents(s => s.clear())
        setFilteredStudents([])
        scrollerRef!.current!.resetData()
    }, [scrollerRef])

    const filterFn = useCallback((s: StudentPreview) => (
        (!filter.promos.length || filter.promos.includes(s.promo)) && (!filter.name || new RegExp(filter.name, "i").test(s.firstName+" "+s.lastName))
    ), [filter.promos.length, filter.name])
    
    // Infinite Scroller next students
    const getNextStudents: loaderCallback = useCallback(async (page: number) => {
        const res = await searchStudents(page, filter.name, filter.promos.toString(), filter.atoz)
        if(res.status === 200) {
            const parsedResults = parseSearchResults(res.data.content)

            setStudents(stds => stds.addAll(parsedResults))
            setFilteredStudents(students.filter(filterFn))
            return res.data.last
        }
        return false
    }, [filter, students])

    /**
     * Filter Update
     */
    useEffect(() => {
        setFilteredStudents(students.filter(filterFn))
    }, [filterFn, filter.promos.length, filter.name])
    return (
        <div className="container mx-auto text-center mt-10 mb-20">
            <div className="font-bold text-indigo-500 py-3 text-4xl">
                {t("students")}
            </div>

            <HorizontalSpacer spacing={6}/>
            <YearBookSearchBar filter={filter} onFilterUpdate={setFilter} onSortingSwitch={switchSorting}/>
            <HorizontalSpacer spacing={8}/>

            {/* List of students */}
            <InfiniteScroller
                ref={scrollerRef}
                watch="DOWN"
                callback={getNextStudents}
                triggerDistance={5}
                className="flex flex-wrap justify-start"
            >
                {filteredStudent.map((student, i) =>
                    <StudentCard key={i} student={student}/>
                )}
            </InfiniteScroller>
        </div>
    )
}


export default YearBook