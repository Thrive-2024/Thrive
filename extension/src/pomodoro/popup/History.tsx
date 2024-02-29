import { useState, useEffect, useContext } from 'react'
import { DisplayTermType, DailyPomodoro } from '../types/index'
import LoadingSpinner from '../components/LoadingSpinner'
import { getStorage } from '../utils/chrome'
import HistoryChart from '../features/history/HistoryChart'
import TargetTerm from '../features/history/TargetTerm'
import useFormatHistoryData from '../features/history/hooks/useFormatHisotryData'
import { DEFAULT_POPUP_PAGE_TYPE } from '../consts'
import { DisplayPageContext } from './DisplayPageContextProvider'
import ArrowBackward from '../components/ArrowBackward'
import { translation } from '../_locales/en'

const History: React.FC = () => {
  const [dailyPomodoros, setDailyPomodoros] = useState<DailyPomodoro[]>([])
  const [displayTermType, setDisplayTermType] =
    useState<DisplayTermType>('week')
  const [timesGoBack, setTimesGoBack] = useState<number>(0)
  const termTypes: DisplayTermType[] = ['week', 'month', 'year']
  const { setDisplayPageType } = useContext(DisplayPageContext)

  useEffect(() => {
    getStorage(['dailyPomodoros']).then((data) => {
      setDailyPomodoros(data.dailyPomodoros)
    })
  }, [displayTermType, timesGoBack])

  const handleChangeDisplayTermType = (term: DisplayTermType): void => {
    setDisplayTermType(term)
    setTimesGoBack(0)
  }

  const handleGoBack = (): void => {
    setTimesGoBack(timesGoBack + 1)
  }

  const handleMoveForward = (): void => {
    setTimesGoBack(timesGoBack - 1)
  }

  const getTermTypeString = (term: DisplayTermType): string => {
    switch (term) {
      case 'week':
        return translation.history.termType.weekly
      case 'month':
        return translation.history.termType.monthly
      case 'year':
        return translation.history.termType.yearly
    }
  }

  const historyData = useFormatHistoryData(
    dailyPomodoros,
    displayTermType,
    timesGoBack
  )

  return (
    <div id="history">
      <ArrowBackward
        handleClick={() => setDisplayPageType(DEFAULT_POPUP_PAGE_TYPE)}
        className="h-3 w-3"
      />
      <div className="mx-auto">
        <div className="flex h-8 justify-center">
          <div className="flex w-4/5 rounded-lg border bg-gray-200 p-[2px] dark:border-gray-700 dark:bg-gray-900">
            {termTypes.map((term) => (
              <button
                key={term}
                className={`${
                  displayTermType === term ? 'bg-gray-50 dark:bg-gray-700' : ''
                } px-2s flex-auto rounded-md`}
                onClick={() => {
                  handleChangeDisplayTermType(term)
                }}
              >
                {getTermTypeString(term)}
              </button>
            ))}
          </div>
        </div>
        <div className="mt-5">
          <TargetTerm
            displayTermType={displayTermType}
            timesGoBack={timesGoBack}
            onGoBack={handleGoBack}
            onMoveForward={handleMoveForward}
          />
        </div>
      </div>
      {historyData.length === 0 ? (
        <div className="flex h-[15rem] items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <HistoryChart historyData={historyData} />
      )}
    </div>
  )
}

export default History
