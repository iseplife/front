import { ClubPreview } from "../../club/types"
import { EventPreview } from "../../event/types"
import { SearchItem } from "../../searchbar/types"
import { StudentPreview } from "../../student/types"

export interface IORSession {
    id: number
    
    start: Date
    ending: Date
}

export interface IORVotedQuestion {
    question: IORQuestion
    vote: SearchItem
    choices: (SearchItem)[]
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