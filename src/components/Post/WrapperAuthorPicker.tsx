import React, {useContext, useEffect, useState} from "react"
import {FeedContext} from "../../context/feed/context"
import AuthorPicker, {AuthorPickerProps} from "../Common/AuthorPicker"
import {getAuthorizedAuthors} from "../../data/post"
import {Author} from "../../data/request.type"

type WrapperAuthorPickerProps = Omit<AuthorPickerProps, "authors">
const WrapperAuthorPicker: React.FC<WrapperAuthorPickerProps> = (props)=> {
    const context = useContext(FeedContext)
    const [authors, setAuthors] = useState<Author[]>([])

    useEffect(() => {
        if(context)
            setAuthors(context.authors)
        else
            getAuthorizedAuthors().then(res => setAuthors(res.data))
    }, [context])

    return <AuthorPicker authors={authors} {...props}/>
}

export default WrapperAuthorPicker