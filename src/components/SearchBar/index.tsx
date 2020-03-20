import {Icon, Input, Select, Spin} from "antd";
import React, {useEffect, useState} from "react";
import {getFakeData, globalSearch, searchClub} from "../../data/searchbar";

const {Option, OptGroup} = Select;
const {Search} = Input;

const fakeData = [
    {
        id: 1,
        type: "CLUB",
        name: "Air ISEP",
        thumbUrl: "/tmp/picture/test.jpg"
    },
    {
        id: 2,
        type: "CLUB",
        name: "Garage ISEP",
        thumbUrl: "/tmp/picture/garage.jpg"
    },
    {
        id: 3,
        type: "STUDENT",
        name: "Bastien Grignon",
        thumbUrl: "/tmp/picture/garage.jpg"
    },
    {
        id: 4,
        type: "STUDENT",
        name: "Lucas Perrault",
        thumbUrl: "/tmp/picture/garage.jpg"
    }
];

type SearchItem = {
    id: number,
    type: string,
    name: string,
    thumbUrl: string,
    description?: string,
    status?: boolean
}

const SearchBar: any = () => {

    const [isLoading, setIsLoading] = useState<boolean>(true);
    const [currentSearch, setCurrentSearch] = useState<string>("");
    const [data, setData] = useState<any>(fakeData);

    const handleSearch = (typedValue: string) => {
        console.log("Nouvelle recherche : " + typedValue);
        setData(null);
        setIsLoading(true);
        setData(fakeData);
        setIsLoading(false);

    };

    const handleChange = (typedValue: string) => {
        setData(null);
        setCurrentSearch(typedValue);
        setIsLoading(false)
    };

    return (
        <Select showSearch={true} onSearch={handleSearch} onChange={handleChange}
                filterOption={false} suffixIcon={<Icon type="search"/>}
                defaultActiveFirstOption={false} className="my-auto w-1/4"
                placeholder="Cherchez ce que vous voulez">
            {
                data.map((item: any, key: any) => {
                    return (
                        <Option key{...key}>{item.name}</Option>
                    );
                })
            }
        </Select>
    );
};

export default SearchBar;