import {FormikErrors, withFormik} from "formik"
import PostForm, {PostFormValues} from "./PostForm"
import {Embed, EmbedEdition, EmbedEnumType, EmbedGallery, EmbedMedia, EmbedPoll, EmbedPseudoGallery, Post} from "../../../data/post/types"
import {mediaPath} from "../../../util"
import {PostSizes} from "../../../constants/MediaSizes"
import {updatePoll} from "../../../data/poll"
import {updatePost} from "../../../data/post"
import {message} from "antd"
import {createMedia} from "../../../data/media"
import {addGalleryImages, deleteGalleryImages} from "../../../data/gallery"

type PostEditFormProps = {
    post: Post,
    onEdit: (post: Post) => void
    onClose: () => void
}
const PostEditForm = withFormik<PostEditFormProps, PostFormValues<EmbedEdition>>({
    mapPropsToValues: ({post}) => {
        const embed: EmbedEdition = {
            type: post.embed.embedType
        } as EmbedEdition

        let postEmbed: Embed
        switch (post.embed.embedType) {
            case EmbedEnumType.GALLERY:
                postEmbed = post.embed as EmbedGallery
                if (postEmbed.pseudo) {
                    embed.data = postEmbed.preview.map(img => ({
                        id: img.id,
                        file: mediaPath(img.name, PostSizes.PREVIEW) as string,
                        nsfw: img.nsfw
                    }))
                } else {
                    // Can't edit true gallery from post
                    console.error("modification impossible")
                }
                break
            case EmbedEnumType.IMAGE:
                postEmbed = post.embed as EmbedPseudoGallery
                embed.data = post.embed.images.map(img => ({
                    id: img.id,
                    file: mediaPath(img.name, PostSizes.PREVIEW) as string,
                    nsfw: img.nsfw
                }))
                break
            case EmbedEnumType.VIDEO:
            case EmbedEnumType.DOCUMENT:
                postEmbed = post.embed as EmbedMedia
                embed.data = [{
                    id: postEmbed.id,
                    file: mediaPath(postEmbed.name, PostSizes.PREVIEW) as string,
                    nsfw: postEmbed.nsfw
                }]
                break
            case EmbedEnumType.POLL:
                postEmbed = post.embed as EmbedPoll
                embed.data = {
                    ...postEmbed,
                    choices: postEmbed.choices.map(c => ({
                        id: c.id,
                        content: c.content
                    }))
                }
                break
        }

        return {
            id: post.id,
            description: post.description,
            publicationDate: post.publicationDate,
            embed,
            private: post.private,
            draft: false
        }
    },

    validate: (values) => {
        const errors: FormikErrors<PostFormValues<EmbedEdition>> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },

    handleSubmit: async (values, {props}) => {
        const {embed, ...post} = values

        if (embed) {
            switch (embed.type) {
                case EmbedEnumType.IMAGE: {
                    // Edit and create images
                    const newImagesID = []
                    for (const img of embed.data) {
                        if ("id" in img) {
                            console.log("oui")
                        } else {
                            const res = await createMedia(img)
                            newImagesID.push(res.data.id)
                        }
                    }
                    await addGalleryImages(props.post.embed.id, newImagesID)

                    // Remove media that are no longer present in form
                    const removeImagesID = []
                    for (const img of (props.post.embed as EmbedPseudoGallery).images) {
                        if (!embed.data.find(comparedImg => "id" in comparedImg && comparedImg.id == img.id)) {
                            removeImagesID.push(img.id)
                        }
                    }
                    await deleteGalleryImages(props.post.embed.id, removeImagesID)

                    break
                }
                case EmbedEnumType.DOCUMENT:
                case EmbedEnumType.VIDEO: {

                    break
                }
                case EmbedEnumType.POLL: {
                    await updatePoll(embed.data)
                    break
                }
                case EmbedEnumType.GALLERY:
                default:
            }
        }

        const res = await updatePost(
            props.post.id,
            {
                ...post,
                removeEmbed: props.post.embed != undefined && embed == undefined
            }
        )
        if (res.status === 200) {
            props.onEdit(res.data)
            props.onClose()
            message.success("Post publié !")
        }
    },
    displayName: "PostEditForm"
})(PostForm)

export default PostEditForm
