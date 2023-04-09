import { StudentPreview } from "../../data/student/types";

export default interface PollVoteItem {
    id: number;
    content: string;
    students: StudentPreview[];
}

export interface LikePreview {
    student: StudentPreview;
}