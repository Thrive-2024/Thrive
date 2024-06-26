import { twMerge } from 'tailwind-merge'
import { COLOR } from '../consts/color'

type IProps = {
  handleClick: () => void
  className?: string
}
const ArrowForward = ({ handleClick, className }: IProps) => {
  return (
    <button className="relative" onClick={handleClick}>
      <div
        color={COLOR.gray[500]}
        className={twMerge(
          'icon-border-color absolute left-1 top-1 block h-2 w-2 rotate-45 border-r-[3px] border-t-[3px]',
          className
        )}
      ></div>
    </button>
  )
}

export default ArrowForward
