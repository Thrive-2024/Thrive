import { useContext } from 'react'
import History from './History'
import Settings from './Settings'
import DisplayPageContextProvider, {
  DisplayPageContext
} from './DisplayPageContextProvider'
import Timer from './Timer'
import { Typography } from '@mui/material'

const PomodoroInner = () => {
  const { displayPageType } = useContext(DisplayPageContext)

  return (
    <div className="base-bg-color text-color min-w-[17rem] max-w-[20rem] p-4">
      {displayPageType === 'timer' ? (
        <Timer />
      ) : displayPageType === 'history' ? (
        <History />
      ) : displayPageType === 'settings' ? (
        <Settings />
      ) : (
        <p>loading</p>
      )}
    </div>
  )
}
const Pomodoro: React.FC = () => {
  return (
      <DisplayPageContextProvider>
        <PomodoroInner />
      </DisplayPageContextProvider>
  )
}

export default Pomodoro
