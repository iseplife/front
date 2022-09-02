import { Post } from "../post/types"
import { StudentPreview } from "../student/types"
import { Comment } from "../thread/types"

export interface Report {
    id: number
    comment?: Comment
    post?: Post
    student: StudentPreview
}