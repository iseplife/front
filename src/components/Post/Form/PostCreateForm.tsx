import {FormikErrors, withFormik} from "formik"
import {message} from "antd"
import PostForm, {PostFormValues} from "./PostForm"
import {DEFAULT_EMBED, EmbedCreation, EmbedEnumType, PostCreation, PostUpdate} from "../../../data/post/types"
import {AxiosResponse} from "axios"
import {createMedia} from "../../../data/media"
import {createGallery} from "../../../data/gallery"
import {createPoll} from "../../../data/poll"
import {createPost} from "../../../data/post"
import { LoggedStudentPreview } from "../../../data/student/types"


type PostCreateFormProps = {
    type: EmbedEnumType
    feed?: number
    user: LoggedStudentPreview
    text?: string
    onSubmit: (post: PostUpdate) => void
    onClose: () => void
    edit?: boolean
}
const PostCreateForm = withFormik<PostCreateFormProps, PostFormValues<EmbedCreation>>({
    mapPropsToValues: ({type, text, edit}) => ({
        description: "",
        publicationDate: new Date(),
        embed: DEFAULT_EMBED[type],
        private: true,
        text,
        edit
    }),

    validate: (values) => {
        const errors: FormikErrors<PostFormValues<EmbedCreation>> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },

    handleSubmit: async (values, { props, resetForm }) => {
        props = { ...props }
        const { embed, ...post } = values
        props.feed = props.feed ?? values.selectedClub?.feedId ?? props.user.feedId

        try {
            embed_block: if (embed) {
                let res: AxiosResponse<{ id: number }>
                switch (embed.type) {
                    case EmbedEnumType.IMAGE: {
                        if(embed.data.length == 0)
                            break embed_block
                        const ids = []
                        for (const f of embed.data) {
                            const res = await createMedia(f, embed.type, values.selectedClub?.id)
                            ids.push(res.data.id)
                        }

                        res = await createGallery({
                            feed: props.feed,
                            pseudo: true,
                            images: ids
                        })
                        break
                    }
                    case EmbedEnumType.DOCUMENT:
                        if(embed.data?.file == undefined)
                            break embed_block
                        res = await createMedia(embed.data, embed.type, values.selectedClub?.id)
                        break
                    case EmbedEnumType.VIDEO:
                        if(embed.data.length == 0)
                            break embed_block
                        res = await createMedia(embed.data[0], embed.type, values.selectedClub?.id)
                        break
                    case EmbedEnumType.POLL:
                        if(embed.data.choices.length == 0)
                            break embed_block
                        if(embed.data.choices.find(choice => (choice as any) == "" || !choice.content.length) != undefined)
                            return
                        res = await createPoll(embed.data)
                        break
                    case EmbedEnumType.GALLERY:
                    default: {
                        throw new Error("weird")
                    }
                }

                (post as PostCreation).attachements = {[embed.type]: res.data.id}
            }
            (post as PostCreation).feed = props.feed
            post.linkedClub = post.selectedClub?.id
            const res = await createPost(post as PostCreation)
            if (res.status === 200) {
                props.onSubmit(res.data)
                props.onClose()
                resetForm({})
                message.success("Post publié !")
            }
        } catch (e: any) {
            message.error(e.message)
        }

    },
    displayName: "PostCreateForm"
})(PostForm)

export default PostCreateForm
