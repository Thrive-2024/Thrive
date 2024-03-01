import { COLOR } from "../consts/color"

const Pause: React.FC = () => {
  return (
    <svg
      id="pause"
      xmlns="http://www.w3.org/2000/svg"
      fill="white"
      viewBox="0 0 24 24"
      strokeWidth="1.5"
      stroke= "white"
      className="w-5 h-5 icon-color"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M15.75 5.25v13.5m-7.5-13.5v13.5"
      />
    </svg>
  )
}

export default Pause
