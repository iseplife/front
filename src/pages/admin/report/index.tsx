import { useCallback, useEffect, useState } from "react"
import Comment from "../../../components/Comment"
import Post from "../../../components/Post"
import { getAllReports } from "../../../data/feed"
import { deletePost } from "../../../data/post"
import { Report } from "../../../data/report"
import { deleteThreadCommentById } from "../../../data/thread"
import { ManagerPost } from "../../../datamanager/FeedsManager"

const ReportPanel = () => {
    const [reports, setReports] = useState([] as Report[])
    useEffect(() => {
        getAllReports().then(data => setReports(data.data.map(report => ({
            comment: !report.comment ? undefined : {
                ...report.comment,
                hasWriteAccess: true,
            },
            post: !report.post ? undefined : {
                ...report.post,
                hasWriteAccess: true,
            },
            student: report.student,
            id: report.id,
        }))))
    }, [])

    const onDeleteComment = useCallback(async (index: number) => {
        deleteThreadCommentById(index).then(() => setReports(reports => reports.filter(report => report.comment?.id != index)))
    }, [])
    const onDeletePost = useCallback(async (index: number) => {
        deletePost(index).then(() => setReports(reports => reports.filter(report => report.post?.id != index)))
    }, [])


    return <div className="container mx-auto gap-3 flex flex-col">
        {
            reports.map(report => <div>
                <div className="font-semibold"> {report.student.firstName} {report.student.lastName} reported :</div>
                {
                    report.post && <Post data={report.post as ManagerPost} feedId={0} isEdited={false} onDelete={onDeletePost} onPin={undefined!} onReport={undefined!} onUpdate={undefined!} toggleEdition={undefined!}  />
                }
                {
                    report.comment && <div className="rounded-lg shadow-sm bg-white p-2">
                        <Comment data={report.comment} allowReplies={false} handleDeletion={onDeleteComment} handleEdit={undefined!} lightboxView={false} />
                    </div>
                }
            </div>)
        }
    </div>
}

export default ReportPanel