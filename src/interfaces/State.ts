import { ColorResult } from "react-color"

interface Notification {
  show: boolean
  message: string
}

export interface State {
  defaultColor: ColorResult
  backgroundColor: ColorResult
  usePalette: boolean
  notification: Notification
}
