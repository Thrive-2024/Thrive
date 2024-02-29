import React, { useEffect, useState } from 'react'
import BreakIcon from '../../components/Break'
import FocusIcon from '../../components/Focus'
import { twMerge } from 'tailwind-merge'
import { getStorage } from '../../utils/chrome'
import { Phase } from '../../types'
import { translation } from '../../_locales/en'

type IProps = {
  inPopup: boolean
}
const iconStyle = 'w-6 h-6'

const CurrentPhase: React.FC<IProps> = ({ inPopup = false }) => {
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)

  useEffect(() => {
    getStorage(['phase']).then(({ phase }) => {
      setCurrentPhase(phase)
    })
  })
  const getCurrentPhaseText = (): string => {
    switch (currentPhase) {
      case 'focus':
        return translation.common.pomodoro
      case 'break':
        return translation.common.break
      case 'longBreak':
        return translation.common.longBreak
      default:
        return ''
    }
  }

  return (
    <div className="flex items-center">
      {currentPhase === 'focus' ? (
        <FocusIcon className={inPopup ? iconStyle : ''} />
      ) : (
        <BreakIcon className={inPopup ? iconStyle : ''} />
      )}
      <span className={twMerge('ml-1', inPopup ? 'text-base' : 'text-2xl')}>
        {getCurrentPhaseText()}
      </span>
    </div>
  )
}

export default CurrentPhase
