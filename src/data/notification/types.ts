import { NotificationType } from "../../constants/NotificationType"

export interface Notification {
  id: number

  type: NotificationType
  
  icon: string
  link: string

  watched: boolean

  informations: { [key: string]: any }

  creation: Date
}
