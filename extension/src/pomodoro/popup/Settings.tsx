import React, { useContext, useEffect, useState } from 'react'
import TimerLengthSelect from '../features/settings/TimerLengthSelect'
import SettingToggle from '../features/settings/SettingToggle'
import { translation } from '../_locales/en'
import { getStorage } from '../utils/chrome'
import { Phase, StorageValue } from '../types/index'
import {
  POMODORO_LENGTH_ARRAY,
  BREAK_LENGTH_ARRAY,
  LONG_BREAK_LENGTH_ARRAY,
  POMODORO_COUNT_UNTIL_LONG_BREAK,
  DEFAULT_POPUP_PAGE_TYPE
} from '../consts/index'
import SettingRow from '../features/settings/SettingRow'
import { twMerge } from 'tailwind-merge'
import { DisplayPageContext } from './DisplayPageContextProvider'
import ArrowBackward from '../components/ArrowBackward'

const headingStyle = 'font-bold text-weight text-center'

const Settings: React.FC = () => {
  const [currentPhase, setcurrentPhase] = useState<Phase>('focus')
  const [pomodoroSeconds, setpomodoroSeconds] = useState<number>(0)
  const [breakSeconds, setbreakSeconds] = useState<number>(0)
  const [longBreakSeconds, setlongBreakSeconds] = useState<number>(0)
  const [
    showDesktopNotificationWhenPomodoro,
    setShowDesktopNotificationWhenPomodoro
  ] = useState<boolean | null>(null)
  const [
    showDesktopNotificationWhenBreak,
    setShowDesktopNotificationWhenBreak
  ] = useState<boolean | null>(null)
  const [
    showNewTabNotificationWhenPomodoro,
    setShowNewTabNotificationWhenPomodoro
  ] = useState<boolean | null>(null)
  const [
    showNewTabNotificationWhenBreak,
    setShowNewTabNotificationWhenBreak
  ] = useState<boolean | null>(null)
  const [pomodorosUntilLongBreak, setpomodorosUntilLongBreak] =
    useState<number>(0)
  const { setDisplayPageType } = useContext(DisplayPageContext)

  useEffect(() => {
    getStorage([
      'pomodoroSeconds',
      'breakSeconds',
      'longBreakSeconds',
      'showDesktopNotificationWhenPomodoro',
      'showDesktopNotificationWhenBreak',
      'showNewTabNotificationWhenPomodoro',
      'showNewTabNotificationWhenBreak',
      'pomodorosUntilLongBreak'
    ]).then((value: StorageValue) => {
      setcurrentPhase(value.phase)
      setpomodoroSeconds(value.pomodoroSeconds)
      setbreakSeconds(value.breakSeconds)
      setlongBreakSeconds(value.longBreakSeconds)
      setShowDesktopNotificationWhenPomodoro(
        value.showDesktopNotificationWhenPomodoro
      )
      setShowDesktopNotificationWhenBreak(
        value.showDesktopNotificationWhenBreak
      )
      setShowNewTabNotificationWhenPomodoro(
        value.showNewTabNotificationWhenPomodoro
      )
      setShowNewTabNotificationWhenBreak(value.showNewTabNotificationWhenBreak)
      setpomodorosUntilLongBreak(value.pomodorosUntilLongBreak)
    })
  }, [])

  return (
    <div>
      <ArrowBackward
        handleClick={() => setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)}
        className="ml-3 h-3 w-3"
      />
      <div id="settings" className={twMerge('text-base')}>
        <div
          id="timerSetting"
          className="border-b-2 border-gray-300 pb-2"
        >
          <p className={twMerge(headingStyle)}>{translation.settings.timer.title}</p>
          <div className="mt-3 text-sm">
            <SettingRow label={translation.settings.timer.length.pomodoro}>
              <TimerLengthSelect
                phase={currentPhase}
                type="pomodoroSeconds"
                options={POMODORO_LENGTH_ARRAY}
                currentValue={pomodoroSeconds}
              />
            </SettingRow>
            <SettingRow label={translation.settings.timer.length.break}>
              <TimerLengthSelect
                phase={currentPhase}
                type="breakSeconds"
                options={BREAK_LENGTH_ARRAY}
                currentValue={breakSeconds}
              />
            </SettingRow>
            <SettingRow label={translation.settings.timer.length.longBreak}>
              <TimerLengthSelect
                phase={currentPhase}
                type="longBreakSeconds"
                options={LONG_BREAK_LENGTH_ARRAY}
                currentValue={longBreakSeconds}
              />
            </SettingRow>
            <SettingRow label={translation.settings.timer.count.untilLongBreak}>
              <TimerLengthSelect
                phase={currentPhase}
                type="pomodorosUntilLongBreak"
                options={POMODORO_COUNT_UNTIL_LONG_BREAK}
                currentValue={pomodorosUntilLongBreak}
              />
            </SettingRow>
          </div>
        </div>
        <div id="notificationSetting" className="mt-3">
          <p className={twMerge(headingStyle)}>
            {translation.settings.notification.title}
          </p>
          <div className="mt-2 text-sm">
            <SettingRow label={translation.settings.notification.desktop.pomodoro}>
              {showDesktopNotificationWhenPomodoro !== null && (
                <SettingToggle
                  id="showDesktopNotificationWhenPomodoro"
                  currentValue={showDesktopNotificationWhenPomodoro}
                />
              )}
            </SettingRow>
            <SettingRow label={translation.settings.notification.showNewTab.pomodoro}>
              {showNewTabNotificationWhenPomodoro !== null && (
                <SettingToggle
                  id="showNewTabNotificationWhenPomodoro"
                  currentValue={showNewTabNotificationWhenPomodoro}
                />
              )}
            </SettingRow>
            <SettingRow label={translation.settings.notification.desktop.break}>
              {showDesktopNotificationWhenBreak !== null && (
                <SettingToggle
                  id="showDesktopNotificationWhenBreak"
                  currentValue={showDesktopNotificationWhenBreak}
                />
              )}
            </SettingRow>
            <SettingRow label={translation.settings.notification.showNewTab.break}>
              {showNewTabNotificationWhenBreak !== null && (
                <SettingToggle
                  id="showNewTabNotificationWhenBreak"
                  currentValue={showNewTabNotificationWhenBreak}
                />
              )}
            </SettingRow>
          </div>
        </div>
      </div>
    </div>
  )
}

const SettingsContainer: React.FC = () => {
  return <Settings />
}

export default SettingsContainer
