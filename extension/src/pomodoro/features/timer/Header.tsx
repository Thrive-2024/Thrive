import Chart from '../../components/Chart'
import Cogwheel from '../../components/Cogwheel'
import { useContext } from 'react'
import CurrentPhase from './CurrentPhase'
import { DisplayPageContext } from '../../popup/DisplayPageContextProvider'
import { Typography } from '@mui/material'

const HeaderMenu = () => {
  const { setDisplayPageType } = useContext(DisplayPageContext)
  return (
    <div>
      <div className="mt-0 flex justify-between ml-5">
        <div className="flex gap-1">
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
      <div className="flex justify-center items-center text-center ml-5">
        <Typography
          sx={{
            fontSize:'15px',
            color:'black', 
            marginTop:'20px', 
          }}
      >
        "Slay. Serve. Survive" - Prof Ben
      </Typography>
    </div>
  </div>
  )
}

export default HeaderMenu
