import {FormikErrors, withFormik} from "formik"
import PostForm, {PostFormValues} from "./PostForm"
import {
    Embed,
    EmbedCreation,
    EmbedEdition,
    EmbedEnumType,
    EmbedMedia,
    EmbedPoll,
    EmbedPseudoGallery,
    Post,
    PostUpdate,
    PostUpdateForm
} from "../../../data/post/types"
import {mediaPath} from "../../../util"
import {PostSizes} from "../../../constants/MediaSizes"
import {createPoll, updatePoll} from "../../../data/poll"
import {createMedia} from "../../../data/media"
import {addGalleryImages, createGallery, deleteGalleryImages} from "../../../data/gallery"
import {MediaUploadNSFW} from "../../../data/media/types"
import { feedsManager } from "../../../datamanager/FeedsManager"
import {message} from "antd"

type PostEditFormProps = {
    post: Post,
    onEdit: (post: PostUpdate) => void
    onClose: () => void
}
const PostEditForm = withFormik<PostEditFormProps, PostFormValues<EmbedEdition | EmbedCreation>>({
    mapPropsToValues: ({post}) => {
        let embed: EmbedEdition | undefined = undefined
        if (post.embed) {
            embed = {
                type: post.embed.embedType
            } as EmbedEdition

            let postEmbed: Embed
            switch (post.embed.embedType) {
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
        }

        return {
            id: post.id,
            description: post.description,
            publicationDate: post.publicationDate,
            embed: embed,
            edit: true,
        }
    },

    validate: (values) => {
        const errors: FormikErrors<PostFormValues<EmbedEdition | EmbedCreation>> = {}
        if (!values.description.length) {
            errors.description = "Required"
        }
        return errors
    },

    handleSubmit: async (values, {props}) => {
        const {embed, ...postForm} = values
        const post = postForm as PostUpdateForm

        try {
            if (embed) {
                switch (embed.type) {
                    case EmbedEnumType.IMAGE: {
                        if (props.post.embed == null || embed.type != props.post.embed.embedType) {
                            const ids = []
                            for (const img of embed.data) {
                                const res = await createMedia(img as MediaUploadNSFW, embed.type, post.linkedClub)
                                ids.push(res.data.id)
                            }

                            const res = await createGallery({
                                feed: 1, //TODO change this with real feed
                                pseudo: true,
                                images: ids
                            })
                            post.attachements = {[EmbedEnumType.IMAGE]: res.data.id}
                        } else {
                            // create new images
                            const newImagesID = []
                            for (const img of embed.data) {
                                if (!("id" in img)) {
                                    const res = await createMedia(img, embed.type, post.linkedClub)
                                    newImagesID.push(res.data.id)
                                }
                            }
                            if (newImagesID.length > 0)
                                await addGalleryImages(props.post.embed.id, newImagesID)

                            // Remove media that are no longer present in form
                            const removeImagesID = []
                            for (const img of props.post.embed.images) {
                                if (!embed.data.find(comparedImg => "id" in comparedImg && comparedImg.id == img.id)) {
                                    removeImagesID.push(img.id)
                                }
                            }
                            if (removeImagesID.length > 0)
                                await deleteGalleryImages(props.post.embed.id, removeImagesID)
                        }
                        break
                    }
                    case EmbedEnumType.DOCUMENT:
                        if (!("id" in embed.data)) {
                            const res = await createMedia(embed.data, embed.type, post.linkedClub)
                            post.attachements = {[EmbedEnumType.DOCUMENT]: res.data.id}
                        }
                        break
                    case EmbedEnumType.VIDEO: {
                        const media = embed.data[0]
                        if (!("id" in media)) {
                            const res = await createMedia(media, embed.type, post.linkedClub)
                            post.attachements = {[EmbedEnumType.VIDEO]: res.data.id}
                        }
                        break
                    }
                    case EmbedEnumType.POLL: {
                        if (props.post.embed == null || embed.type != props.post.embed.embedType) {
                            const res = await createPoll(embed.data)
                            post.attachements = {[EmbedEnumType.POLL]: res.data.id}
                        } else {
                            await updatePoll(embed.data)
                        }
                        break
                    }
                }
            }

            props.onEdit(await feedsManager.editPost(
                props.post.id,
                {
                    ...post,
                    removeEmbed: props.post.embed != undefined && embed == undefined
                }
            ))
            props.onClose()
        }catch (e: any) {
            message.error(e.message)
        }

    },
    displayName: "PostEditForm"
})(PostForm)

export default PostEditForm
