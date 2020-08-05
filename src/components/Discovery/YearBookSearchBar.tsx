import React, {useEffect, useState} from "react"
import {Input, Select, Switch} from "antd"
import {useTranslation} from "react-i18next"
import {getAllPromo} from "../../data/student"
import {StudentFilter} from "./YearBook"
import {FilterReducerAction} from "../../data/student/types"

const {Option} = Select

type StudentSearchBarProps = {
    filter: StudentFilter
    onFilterUpdate: React.Dispatch<FilterReducerAction>
    onSortingSwitch: () => void
}

const YearBookSearchBar: React.FC<StudentSearchBarProps> = ({filter, onFilterUpdate, onSortingSwitch}) => {
    const {t} = useTranslation("discovery")
    const [promos, setPromos] = useState<number[]>([])

    /**
     * Get all available promotions on component first load
     */
    useEffect(() => {
        getAllPromo().then(res => {
            setPromos(res.data)
        })
    }, [])

    return (
        <div className="flex flex-col flex-wrap sm:flex-no-wrap sm:justify-between items-center">
            <div className="mx-4 w-full" style={{maxWidth: 1000}}>
                <Input
                    placeholder={t("placeholder_search")}
                    className="text-sm sm:text-lg rounded-full sm:w-full mx-auto sm:mx-0 px-3"
                    onChange={value => onFilterUpdate({type: "UPDATE_SEARCH", name: value.target.value})}
                />
            </div>
            <div className="mt-2 flex items-center">
                <Select
                    defaultValue={[]}
                    mode="multiple"
                    className="w-1/2 sm:w-40 mx-2 rounded"
                    placeholder={t("promotions")}
                    onSelect={(promo: number) => onFilterUpdate({type: "ADD_PROMO", promo: +promo})}
                    onDeselect={(promo: number) => onFilterUpdate({type: "REMOVE_PROMO", promo: +promo})}
                >
                    {promos.map(p => <Option key={p} value={p}>{p}</Option>)}
                </Select>
                <Switch
                    checkedChildren="Az"
                    unCheckedChildren="Za"
                    defaultChecked={filter.atoz}
                    onChange={() => onFilterUpdate({type: "TOGGLE_SORT"})}
                />
            </div>
        </div>
    )
}

export default YearBookSearchBar