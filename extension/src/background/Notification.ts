import { Phase } from '@/types'
import { notifications } from '@/utils/chrome'
import { translation } from '../_locales/en'

const createNotificationContent = async (
  phase: Phase,
  todayPomodoro: number,
  remainingPomodorUntilLongBreak: number
): Promise<string[]> => {
  let title = ''
  let message = ''
  if (phase === 'focus') {
    title = translation.notifications.pomodoro.title
    message = translation.notifications.pomodoro.message
      .replace('%f', String(todayPomodoro))
      .replace('%s', String(remainingPomodorUntilLongBreak))
  } else {
    title = translation.notifications.break.title
    message = translation.notifications.break.message
      .replace('%f', String(todayPomodoro))
      .replace('%s', String(remainingPomodorUntilLongBreak))
  }
  return [title, message]
}

const sendNotification = async (
  title: string,
  message: string
): Promise<void> => {
  notifications.create({
    title,
    message,
    type: 'basic',
    iconUrl: 'assets/img/48.png'
  })
}

export { sendNotification, createNotificationContent }
