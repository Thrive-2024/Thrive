import Chart from '../../components/Chart'
import Cogwheel from '../../components/Cogwheel'
import { useContext } from 'react'
import CurrentPhase from './CurrentPhase'
import { DisplayPageContext } from '../../popup/DisplayPageContextProvider'

const HeaderMenu = () => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  return (
    <div className="mt-2 flex justify-between">
      <div className="flex gap-3">
        <button
          onClick={() => {
            setDisplayPageType('history')
          }}
        >
          <Chart />
        </button>
        <button
          onClick={() => {
            setDisplayPageType('settings')
          }}
        >
          <Cogwheel />
        </button>
      </div>
      <CurrentPhase inPopup />
    </div>
  )
}

export default HeaderMenu
