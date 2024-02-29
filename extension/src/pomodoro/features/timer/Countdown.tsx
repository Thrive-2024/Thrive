import { getTimeFromSeconds } from "../../utils/timeHelper";
import Digit from "./Digit";
import Pause from "../../components/Pause";
import Play from "../../components/Play";
import { expire } from "@/pomodoro/background/Timer";
import { FastForward } from "@mui/icons-material";
import { IconButton } from "@mui/material";

type IProps = {
  remainingSeconds: number;
  isRunning: boolean;
  onToggleStatus: () => void;
  expire: () => void;
};

const Countdown: React.FC<IProps> = ({
  remainingSeconds,
  isRunning,
  onToggleStatus,
  expire,
}) => {
  const { seconds: displaySeconds, minutes: displayMinutes } =
    getTimeFromSeconds(remainingSeconds);

  return (
    <div className="">
      <div id="countdown" className="mt-3 flex w-20 items-center text-2xl">
        <Digit count={displayMinutes} />
        <span className="mx-1 pb-2">:</span>
        <Digit count={displaySeconds} />
      </div>
      <div className="ml-6 mt-2 flex items-center justify-center">
        {isRunning ? (
          <button
            className="mt-3 flex w-full justify-center"
            onClick={onToggleStatus}
          >
            <Pause />
          </button>
        ) : (
          <button
            className="mt-3 flex w-full justify-center"
            onClick={onToggleStatus}
          >
            <Play />
          </button>
        )}

        <IconButton
          onClick={expire}
          // startDecorator={<FastForward />}
          sx={{
            backgroundColor: "#9BC7EC",
            borderRadius: "100px",
            height: "8px",
            width: "8px",
          }}
        >
          <FastForward />
        </IconButton>
      </div>
    </div>
  );
};

export default Countdown;
