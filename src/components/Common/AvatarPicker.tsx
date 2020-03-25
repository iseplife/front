import React, {useEffect, useState} from "react";
import {getPublishersThumbnail} from "../../data/post";
import {Avatar, Dropdown, Menu} from "antd";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/types";
import {Author} from "../../data/request.type";
import Loading from "./Loading";



const PublisherList: React.FC = () => {
    const [loading, setLoading] = useState<boolean>();
    const [publishers, setPublishers] = useState<Author[]>([]);

    /**
     * Call on first render to get all publishers thumbnails
     */
    useEffect(() => {
        setLoading(true);
        getPublishersThumbnail().then(res => {
            if (res.status === 200)
                setPublishers(res.data);
        }).finally(() => setLoading(false));
    }, []);

    return (
        <Menu className="overflow-y-auto overflow-x-hidden" style={{maxHeight: "12rem"}}>
            {loading ?
                <Menu.Item> <Loading size="lg"/> </Menu.Item> :
                publishers.map(p => (
                    <Menu.Item key={p.id}><Avatar icon="user" src={p.thumbnail} size="small"/> {p.name}</Menu.Item>
                ))
            }
        </Menu>
    )
};

interface AvatarPickerProps {
    callback: (id?: number) => void
    className: string
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({callback, className}) => {
    const userThumb = useSelector((state: AppState) => state.user.photoUrlThumb);
    const [selected, setSelected] = useState<Author>();


    /**
     * Return selected author's id through callback
     */
    useEffect(() => {
        // callback(selected.id);
    }, [selected, callback]);

    return (
        <Dropdown overlay={PublisherList({})} trigger={["click"]} placement="bottomRight">
            <Avatar icon="user" src={selected?.thumbnail} className="cursor-pointer mr-3" size="small"/>
        </Dropdown>
    )
};

export default AvatarPicker