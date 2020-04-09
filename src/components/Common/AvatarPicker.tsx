import React, {useEffect, useState} from "react";
import {getPublishersThumbnail} from "../../data/post";
import {Avatar, Select} from "antd";
import {useSelector} from "react-redux";
import {AppState} from "../../redux/types";
import {Author} from "../../data/request.type";
import Loading from "./Loading";

import './AvatarPicker.css';


const {Option} = Select;

interface AvatarPickerProps {
    callback: (id?: number) => void
    compact?: boolean
    className?: string
}

const AvatarPicker: React.FC<AvatarPickerProps> = ({callback, compact, className}) => {
    const userThumb = useSelector((state: AppState) => state.user.picture);
    const [loading, setLoading] = useState<boolean>(true);
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


    //TODO: when migrate to ant.d v4 remove css and use borderless props
    return (
        <Select
            id="avatar-select"
            showArrow={false}
            optionLabelProp={compact ? "label" : "children"}
            defaultValue={0}
            dropdownClassName="w-auto"
            onChange={(value: number) => callback(value || undefined)}
        >
            <Option value={0} label={<Avatar icon="user" src={userThumb} size="small"/>}><Avatar icon="user" src={userThumb} size="small"/> moi</Option>
            {loading ?
                <Option value="loading" disabled> <Loading size="lg"/> </Option> :
                publishers.map(p => (
                    <Option key={p.id} value={p.id} label={<Avatar icon="user" src={p.thumbnail} size="small"/>}>
                        <Avatar icon="user" src={p.thumbnail} size="small"/> {p.name}
                    </Option>
                ))
            }
        </Select>
    )
};

AvatarPicker.defaultProps = {
    className: "",
    compact: false
};

export default AvatarPicker