import {
  FromPopupMessageType,
  FromServiceWorkerMessageType
} from '../utils/message'
export type Response = {
  id: string
}

export type RemainingSeconds = {
  focus: 1500
  break: 300
  longBreak: 1800
}

export type Phase = 'focus' | 'break' | 'longBreak'

export type PageType = 'timer' | 'history' | 'settings'

export type DailyPomodoro = {
  year: number
  month: number
  day: number
  count: number
}

export type StorageValue = {
  remainingSeconds: number
  phase: Phase
  totalPomodoroCountsInSession: number
  dailyPomodoros: DailyPomodoro[]
  isRunning: boolean
  showNewTabNotificationWhenPomodoro: boolean
  showNewTabNotificationWhenBreak: boolean
  showDesktopNotificationWhenPomodoro: boolean
  showDesktopNotificationWhenBreak: boolean
  pomodoroSeconds: number
  breakSeconds: number
  longBreakSeconds: number
  pomodorosUntilLongBreak: number
  isTimerStarted: boolean
  updatingPomodoroSeconds: number
  updatingBreakSeconds: number
  updatingLongBreakSeconds: number
  currentUser: string
}

export type StorageKey = keyof StorageValue

export type DisplayTermType = 'week' | 'month' | 'year'

export type HistoryDataSet = Array<{
  name: string | number
  count: number
}>

export type Message = {
  type: FromPopupMessageType | FromServiceWorkerMessageType
  data?: any
}
