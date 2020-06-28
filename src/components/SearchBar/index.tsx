import {Avatar, Checkbox, Divider, Select} from "antd";
import React, {useEffect, useState} from "react";
import {globalSearch} from "../../data/searchbar";
import {CheckboxValueType} from "antd/es/checkbox/Group";
import {useHistory} from "react-router-dom";
import {SearchItem} from "../../data/searchbar/types";
import {useTranslation} from "react-i18next";

const {Option, OptGroup} = Select;

interface SelectInputProps {
    id?: number
    type?: string
    text: string
    value: string
    thumbURL: string
}

const SearchBar: any = () => {
    const {t} = useTranslation('search');
    let history = useHistory();
    const [data, setData] = useState<SelectInputProps[]>([]);
    const [value, setValue] = useState<string>("");
    const [fetching, setFetching] = useState<boolean>(false);
    const checkboxOptions = [t("student"), t("club"), t("event")];
    let currentValue: string;

    useEffect(() => {
        updateSearchItems("");
    }, []);

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

    //Todo: make the checkbox select search type (club, event, user)
    const handleCheckboxSearch = (checkboxValue: CheckboxValueType[]) => {
        console.log(checkboxValue);
    };

    const customDropdownRender = (menu: React.ReactNode) => (
        <div>
            <div className="inline-flex flex-no-wrap p-3">
                <div className="font-bold mr-4">Filtre :</div>
                <Checkbox.Group options={checkboxOptions} onChange={handleCheckboxSearch}
                                disabled={true}/>
            </div>
            <Divider className="my-1"/>
            {menu}
        </div>
    );

    return (
        <Select showSearch
                placeholder={t("placeholder")}
                mode="default"
                value={!!value ? value : undefined}
                className="my-auto w-1/2 md:w-2/5 lg:w-5/12 xl:w-1/4"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                onSelect={handleSelect}
                loading={fetching}
                dropdownRender={menu => customDropdownRender(menu)}>
            {renderOptions()}
        </Select>
    );
};

export default SearchBar;