import { getTimeFromSeconds } from "../../utils/timeHelper";
import Digit from "./Digit";
import Pause from "../../components/Pause";
import Play from "../../components/Play";
import FastForward from "../../components/FastForward";
import { expire } from "@/pomodoro/background/Timer";
import { IconButton, Typography } from "@mui/material";
import { useEffect, useState } from "react";

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
  const [selectedTask, setSelectedTask] = useState<string>("");
  useEffect(() => {
    const fetchData = async () => {
      const data = await new Promise<{ selectedTask: string }>((resolve) => {
        chrome.storage.sync.get("selectedTask", (data) => {
          resolve({ selectedTask: data.selectedTask.taskName });
        });
      });
      setSelectedTask(data.selectedTask);
    };

    fetchData();
  }, []);
  return (
    <div className="">
      <div className="items-center mb-0 mt-1 flex">
        <Typography
          sx={{
            fontSize: "13px",
            color: "#A3A3A3",
          }}
        >
          {selectedTask}
        </Typography>
      </div>
      <div id="countdown" className="mt-0 flex w-20 items-center justify-center text-2xl">
        <Digit count={displayMinutes} />
        <span className="mx-1 pb-2">:</span>
        <Digit count={displaySeconds} />
      </div>
      <div className="ml-1 mt-2 flex items-center justify-center">
        {isRunning ? (
          <IconButton
            sx={{
              backgroundColor: "#9BC7EC",
              borderRadius: "100px",
              marginRight: "6px",
            }}
            onClick={onToggleStatus}
          >
            <Pause />
          </IconButton>
        ) : (
          <IconButton
            sx={{
              backgroundColor: "#9BC7EC",
              borderRadius: "100px",
              marginRight: "6px",
            }}
            onClick={onToggleStatus}
          >
            <Play />
          </IconButton>
        )}

        <IconButton
          onClick={expire}
          // startDecorator={<FastForward />}
          sx={{
            backgroundColor: "#9BC7EC",
            borderRadius: "100px",
          }}
        >
          <FastForward />
        </IconButton>
      </div>
    </div>
  );
};

export default Countdown;
