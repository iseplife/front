import React, {useCallback} from "react"
import PictureCard from "../../Common/PictureCard"
import {useFormikContext} from "formik"
import {FormValues} from "../PostForm"
import {FileStore} from "./index"

type ImageFormProps = {
    files: FileStore
    setFiles: React.Dispatch<React.SetStateAction<FileStore>>
}
const ImageForm: React.FC<ImageFormProps> = ({files, setFiles}) => {
    const {setFieldValue} = useFormikContext<FormValues>()

    const handleDelete = useCallback((index) => {
        if (files.length - 1 === 0)
            setFieldValue("embed", undefined)
        setFiles(store => store.filter((_, pos) => index !== pos))
    }, [setFiles, files.length])

    const toggleNSFW = (id: number) => {
        setFiles(files.map((file, i) => id == i ? {...file, nsfw: !file.nsfw} : file))
    }


    return (
        <div className="flex">
            {files.map((f, i) =>
                <PictureCard key={i} index={i} file={f.file} onDelete={handleDelete} className="rounded mx-2" toggleNsfw={toggleNSFW}/>
            )}
        </div>
    )
}
export default ImageForm
