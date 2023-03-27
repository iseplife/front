import { ClubPreview } from "../../club/types"
import { EventPreview } from "../../event/types"
import { StudentPreview } from "../../student/types"

export interface IORSession {
    id: number
    
    start: Date
    ending: Date
}

export interface IORVotedQuestion {
    question: IORQuestion
    vote: StudentPreview | EventPreview | ClubPreview
}

export interface IORQuestion {
  id: number;
  position: number;

  title: number;
  
  promo: number;
  type: IORQuestionType;
}

export enum IORQuestionType {
  STUDENT = "STUDENT",
  CLUB = "CLUB",
  EVENT = "EVENT",
}