import React, {useState} from "react";
import {message, Upload, Icon, Button, Avatar} from "antd";
import {IconFA} from "../../../Common/IconFA";
import {useTranslation} from "react-i18next";

const getBase64 = (img: any, callback: any): void => {
    const reader = new FileReader();
    reader.addEventListener('load', () => callback(reader.result));
    reader.readAsDataURL(img);
};

interface StateProps { imageUrl?: string, loading?: boolean }
const CustomCoverClub: React.FC = () => {
    const {t} = useTranslation('club');

    const [state, setState] = useState<StateProps>({
        imageUrl: "",
        loading: false,
    });

    const handleChange = (info: any): void => {
        if (info.file.status === 'uploading') {
            setState({ loading: true });
            return;
        }
        if (info.file.status === 'done') {
            getBase64(info.file.originFileObj, (imageUrl: string) =>
                setState({
                    imageUrl,
                    loading: false,
                }),
            );
        }
    };

    const beforeUpload = (file: any): boolean => {
        const isJpgOrPng = file.type === 'image/jpeg' || file.type === 'image/png' || file.type === 'image/gif';
        if (!isJpgOrPng) {
            message.error(`${t('errorFileType')}`);
        }
        const isLt2M = file.size / 1024 / 1024 < 2;
        if (!isLt2M) {
            message.error(`${t('errorFileSize')}`);
        }
        return isJpgOrPng && isLt2M;
    };

    return (
        <div className="flex flex-row content-center w-full h-full bg-indigo-500 ">
            <Upload
                className="absolute top-0 left-0 m-2 z-10 opacity-25 hover:opacity-100 "
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChange}
            >
                <Button><Icon type="upload"/></Button>
            </Upload>
            {state.imageUrl ? <Avatar shape="square" src={state.imageUrl} className="w-full h-full"></Avatar> : ""}
            {state.loading ? <IconFA name="fa-circle-notch" spin size="2x" className="m-auto text-white" type="solid"/> : ""}
        </div>
    )
};

export default CustomCoverClub;