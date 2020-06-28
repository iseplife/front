import {Checkbox, Divider, Input, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import * as querystring from "querystring";
import {globalSearch, searchClub} from "../../data/searchbar";
import CheckboxGroup from "antd/es/checkbox/Group";

const {Option, OptGroup} = Select;

interface SelectInputProps {
    id?: number
    type?: string
    text: string
    value: string
    thumbURL: string
}

const SearchBar: any = () => {
    const [data, setData] = useState<SelectInputProps[]>([]);
    const [value, setValue] = useState<any>(undefined);
    const [fetching, setFetching] = useState<boolean>(false);
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
            // You need to create the SearchItem type
            const searchItems: SearchItem[] = res.data;

            const data: SelectInputProps[] = [];
            searchItems.map((s: SearchItem) => {
                data.push({
                    id: s.id,
                    type: s.type,
                    value: s.name,
                    text: s.name
                });
            });
            setData(data);
        }).catch((e) => e)
            .finally(() => setFetching(false));
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
        setValue(undefined);
    };

    const handleSelect = (value: string) => {
        const arrayOfTypeAndId = value.split("/");
        const id = arrayOfTypeAndId[0];
        const type = arrayOfTypeAndId[1];
        console.log(value, id, type);
        setValue(value);
    };

    const renderOptions = () => {
        const selectGroupByJson = (groupBy(data, "type"));
        const keys = Object.keys(selectGroupByJson);

        if (!!keys.length) {
            return keys.map((key: string) =>
                <OptGroup label={key} key={key}>
                    {
                        (selectGroupByJson[key] as SelectInputProps[])
                            .map((s: SelectInputProps) => <Option key={s.value}
                                                                  value={`${s.id}/${s.type}`}>{s.text}</Option>)
                    }
                </OptGroup>)
        } else {
            return "";
        }
    };

    return (
        <Select showSearch
                mode="default"
                value={value}
                className="my-auto w-1/4"
                defaultActiveFirstOption={false}
                showArrow={false}
                filterOption={false}
                onSearch={handleSearch}
                onChange={handleChange}
                onSelect={handleSelect}
                loading={fetching}
                dropdownRender={menu => (
                    <div>
                        <div className="flex-no-wrap p-3">
                            <div className="font-bold">Filtre :</div>
                            <CheckboxGroup>
                                <Checkbox>Elève</Checkbox>
                                <Checkbox>Evenement</Checkbox>
                                <Checkbox>Club</Checkbox>
                            </CheckboxGroup>
                        </div>
                        <Divider style={{margin: '4px 0'}}/>
                        {menu}
                    </div>
                )}>
            {renderOptions()}
        </Select>
    );
};

export default SearchBar;