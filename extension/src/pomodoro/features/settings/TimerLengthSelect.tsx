import React from 'react'
import { getStorage, setStorage } from '../../utils/chrome'
import SelectBox from '../../components/SelectBox'
import { translation } from '../../_locales/en'
import { updateSecondsOfBadge } from '../../background/Action'
import { Phase } from '../../types'

type IProps = {
  phase: Phase
  type:
    | 'pomodoroSeconds'
    | 'breakSeconds'
    | 'longBreakSeconds'
    | 'pomodorosUntilLongBreak'
  className?: string
  currentValue: number
  options: number[] | string[]
}
const TimerLengthSelect: React.FC<IProps> = ({
  phase,
  type,
  className = '',
  currentValue,
  options
}) => {
  if (!currentValue || !options) return <p>loading</p>

  const handleOnChange = async (
    e: React.ChangeEvent<HTMLSelectElement>
  ): Promise<void> => {
    if (!e) return

    if (type === 'pomodorosUntilLongBreak') {
      setStorage({ pomodorosUntilLongBreak: Number(e.target.value) })
    } else {
      const isTimerStarted = await (
        await getStorage(['isTimerStarted'])
      ).isTimerStarted
      const formattedValue = Number(e.target.value) * 60
      await updateSecondsOfBadge(formattedValue)
      switch (type) {
        case 'pomodoroSeconds':
          // if (phase == 'focus') await updateSecondsOfBadge(formattedValue)
          if (isTimerStarted) {
            setStorage({ updatingPomodoroSeconds: formattedValue })
          } else {
            setStorage({
              pomodoroSeconds: formattedValue,
              remainingSeconds: formattedValue
            })
          }
          break
        case 'breakSeconds':
          // if (phase == 'break') await updateSecondsOfBadge(formattedValue)
          if (isTimerStarted) {
            setStorage({ updatingBreakSeconds: formattedValue })
          } else {
            setStorage({
              breakSeconds: formattedValue,
              remainingSeconds: formattedValue
            })
          }
          break
        case 'longBreakSeconds':
          // if (phase == 'longBreak') await updateSecondsOfBadge(formattedValue)
          if (isTimerStarted) {
            setStorage({ updatingLongBreakSeconds: formattedValue })
          } else {
            setStorage({
              longBreakSeconds: formattedValue,
              remainingSeconds: formattedValue
            })
          }
          break
      }
    }
  }
  return (
    <div className="w-24">
      <label htmlFor={type} />
      <SelectBox
        id={type}
        defaultValue={
          type !== 'pomodorosUntilLongBreak' ? currentValue / 60 : currentValue
        }
        handleChange={(e) => {
          handleOnChange(e)
        }}
      >
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </SelectBox>
      <span className="ml-2">
        {type === 'pomodoroSeconds' ||
        type === 'breakSeconds' ||
        type === 'longBreakSeconds'
          ? translation.settings.timer.length.unit
          : ''}
      </span>
    </div>
  )
}

export default TimerLengthSelect
