import {Avatar, Divider, Select} from "antd";
import React, {useState} from "react";
import {globalSearch} from "../../data/searchbar";
import {useHistory} from "react-router-dom";
import {SearchItem} from "../../data/searchbar/types";
import {useTranslation} from "react-i18next";
import './searchBar.css'
import {TFunction} from "i18next";

const {Option, OptGroup} = Select;

interface SelectInputProps {
    id?: number
    type?: string
    text: string
    value: string
    thumbURL: string
}

interface CustomCheckBoxProps {
    title: string
    t: TFunction
    filterStatus: boolean
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

const CustomCheckbox: React.FC<CustomCheckBoxProps> = ({title, t, filterStatus, onChange}) => {
    return (
        <>
            <input type="checkbox" className="appearance-none pills"
                   id={`switch-${title.toLowerCase()}`}
                   onMouseDown={e => e.preventDefault()}
                   onChange={onChange} checked={filterStatus}/>
            <label
                className="label-pills inline-flex items-center rounded-full border
                    border-indigo-500 text-indigo-500 px-2 my-auto mx-1 ml-1 cursor-pointer
                    hover:text-white hover:bg-indigo-700"
                htmlFor={`switch-${title.toLowerCase()}`}>{title}</label>
        </>
    );
};

const SearchBar: React.FC = () => {
    const {t} = useTranslation('search');
    let history = useHistory();
    const [data, setData] = useState<SelectInputProps[]>([]);
    const [value, setValue] = useState<string>("");
    const [fetching, setFetching] = useState<boolean>(false);
    const checkboxOptions = [t("student"), t("club"), t("event")];
    let currentValue: string;

    const [filterStudent, setFilterStudent] = useState<boolean>(false);
    const [filterEvent, setFilterEvent] = useState<boolean>(false);
    const [filterClub, setFilterClub] = useState<boolean>(false);

    const groupBy = (array: SelectInputProps[], key: string) => {
        return array.reduce((result: any, currentValue: any) => {
            (result[currentValue[key]] = result[currentValue[key]] || []).push(currentValue);
            return result;
        }, {});
    };

    const updateSearchItems = (queryParams: string) => {
        globalSearch(queryParams, 0).then(res => {
            const searchItems: SearchItem[] = res.data.content;
            const data: SelectInputProps[] = [];
            searchItems.map((searchItem: SearchItem) => {
                return (
                    data.push({
                        id: searchItem.id,
                        type: searchItem.type,
                        value: searchItem.name,
                        text: searchItem.name,
                        thumbURL: searchItem.thumbURL
                    }));
            });
            setData(data);
        }).finally(() => setFetching(false));
    };

    const fetch = (value: string) => {
        currentValue = value;
        setFetching(true);
        if (currentValue === value) {
            updateSearchItems(value);
        }
    };

    const handleSearch = (currentValue: string) => {
        if (!!currentValue) {
            setValue(currentValue);
            fetch(currentValue);
        } else {
            updateSearchItems("");
            setValue("");
        }
    };

    const handleChange = () => {
        setValue("");
    };

    const handleSelect = (value: string) => {
        const arrayOfTypeAndId = value.split("/");
        const id = arrayOfTypeAndId[0];
        const type = arrayOfTypeAndId[1].toLowerCase();
        setValue(value);
        history.push("/" + type + "/" + id);
    };

    const renderOptions = () => {
        const selectGroupByJson = (groupBy(data, "type"));
        const keys = Object.keys(selectGroupByJson);

        if (!!keys.length) {
            return keys.map((key: string) =>
                <OptGroup label={t(key.toLowerCase()).toUpperCase()} key={key}>
                    {
                        (selectGroupByJson[key] as SelectInputProps[]).map((inputProps: SelectInputProps) => {
                            return <Option key={inputProps.value}
                                           value={`${inputProps.id}/${inputProps.type}`}>
                                <div className="inline-flex">
                                    <div>
                                        <Avatar size={"small"} shape={"circle"}
                                                src={inputProps.thumbURL}>
                                            {inputProps.text.split(" ")[0].slice(0, 1)}
                                        </Avatar>
                                    </div>
                                    <div className="ml-2 font-bold">{inputProps.text}</div>
                                </div>
                            </Option>;
                        })
                    }
                </OptGroup>)
        } else {
            return "";
        }
    };

    const customDropdownRender = (menu: React.ReactNode) => (
        <>
            <div className="inline-flex flex-no-wrap p-2 mx-auto items-center">
                <CustomCheckbox title={checkboxOptions[0]} t={t} filterStatus={filterStudent}
                                onChange={(e) => setFilterStudent(e.target.checked)}/>
                <CustomCheckbox title={checkboxOptions[1]} t={t} filterStatus={filterClub}
                                onChange={(e) => setFilterClub(e.target.checked)}/>
                <CustomCheckbox title={checkboxOptions[2]} t={t} filterStatus={filterEvent}
                                onChange={(e) => setFilterEvent(e.target.checked)}/>
            </div>
            <Divider className="my-1"/>
            {menu}
        </>
    );

    return (
        <>
            <Select showSearch
                    showArrow={false}
                    filterOption={false}
                    defaultActiveFirstOption={false}
                    value={!!value ? value : undefined}
                    loading={fetching}
                    mode="default"
                    placeholder={t("placeholder")}
                    className="my-auto w-4/5 md:w-2/5 lg:w-5/12 xl:w-1/5"
                    notFoundContent={null}
                    onSearch={handleSearch}
                    onChange={handleChange}
                    onSelect={handleSelect}
                    dropdownRender={menu => customDropdownRender(menu)}>
                {renderOptions()}
            </Select>
        </>
    );
};

export default SearchBar;