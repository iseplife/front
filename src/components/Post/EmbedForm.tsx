import React from "react";
import {useFormikContext} from "formik";
import EmbedType from "../../constants/EmbedType";
import ImageOverlay from "../Common/ImageOverlay";
import {Icon} from "antd";
import {FormValues} from "./PostForm";

export type FileStore = {
    file: File,
    preview?: string
}[]


type EmbedFormProps = {
    files: FileStore
    setFiles: React.Dispatch<React.SetStateAction<FileStore>>
}
const EmbedForm: React.FC<EmbedFormProps> = ({files, setFiles}) => {
    const {values: {embed}, setFieldValue, setFieldError} = useFormikContext<FormValues>();

    switch (embed!.type) {
        case EmbedType.GALLERY:
            return null;
        case EmbedType.POLL:
            return null;
        case EmbedType.VIDEO:
        case EmbedType.DOCUMENT:
            return (
                <div>
                    {files[0].file.name}
                    <Icon
                        type="delete"
                        className="mx-1 px-1 hover:text-white"
                        onClick={() => {
                            setFiles([])
                            setFieldValue("embed", undefined)
                        }}
                    />
                </div>
            );
        case EmbedType.IMAGE:
            return (
                <div className="flex">
                    {files.map((f,i) => (
                        <div key={i} className="mx-2">
                            <ImageOverlay src={f.preview} height={50}>
                                <Icon
                                    type="delete"
                                    className="mx-1 px-1 hover:text-white"
                                    onClick={() => {
                                        if(files.length - 1 === 0 ) setFieldValue("embed", undefined)
                                        setFiles(store => store.filter((_, pos) => i !== pos))
                                    }}
                                />
                            </ImageOverlay>
                        </div>
                    ))}
                </div>
            )
        default:
            return null;
    }
};

export default EmbedForm