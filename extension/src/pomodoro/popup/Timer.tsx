import { useState, useEffect, useContext } from "react";
import { Message, Phase, StorageValue } from "../types";
import { FromPopupMessageType } from "../utils/message";
import FastForward from "../components/FastForward";
import {
  ColorFormat,
  CountdownCircleTimer,
} from "react-countdown-circle-timer";
import Countdown from "../features/timer/Countdown";
import { COLOR } from "../consts/color";
import { getStorage } from "../utils/chrome";
import PomodoroCircles from "../features/timer/PomodoroCircles";
import { closeTabs } from "../background/Tab";
import { extractTodayPomodoroCount } from "../utils/pomodoroHelper";
import LoadingSpinner from "../components/LoadingSpinner";
import Header from "../features/timer/Header";
import { translation } from "../_locales/en";
import { Button, IconButton } from "@mui/joy";
import Mascot from "../components/mascot.png";

const Timer: React.FC = (props) => {
  const [duration, setDuration] = useState<number>(0);
  const [remainingSeconds, setRemainingSeconds] = useState<number>(0);
  const [todayTotalPomodoroCount, setTodayTotalPomodoroCount] =
    useState<number>(0);
  const [totalPomodoroCountInSession, setTotalPomodoroCountInSession] =
    useState<number>(0);
  const [pomodorosUntilLongBreak, setPomodorosUntilLongBreak] =
    useState<number>(0);
  const [isRunning, setIsRunning] = useState<boolean>(false);
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null);

  useEffect(() => {
    getStorage([
      "remainingSeconds",
      "phase",
      "isRunning",
      "dailyPomodoros",
      "totalPomodoroCountsInSession",
      "pomodorosUntilLongBreak",
    ]).then((value: StorageValue) => {
      setRemainingSeconds(value.remainingSeconds);
      setCurrentPhase(value.phase);
      setIsRunning(value.isRunning);
      setTodayTotalPomodoroCount(
        extractTodayPomodoroCount(value.dailyPomodoros)
      );
      setTotalPomodoroCountInSession(value.totalPomodoroCountsInSession);
      setPomodorosUntilLongBreak(value.pomodorosUntilLongBreak);
    });
  }, []);

  useEffect(() => {
    (async () => {
      currentPhase && setDuration(await getDuration(currentPhase));
      chrome.runtime.onMessage.addListener(async (message: Message) => {
        if (message.type === "reduce-count") {
          setRemainingSeconds(message.data.secs);
        } else if (message.type === "expire") {
          console.log(message.data.phase)
          setCurrentPhase(message.data.phase);
          setDuration(await getDuration(message.data.phase));
          setRemainingSeconds(message.data.secs);
          setIsRunning(false);
          setTodayTotalPomodoroCount(message.data.todayTotalPomodoroCount);
          setTotalPomodoroCountInSession(
            message.data.totalPomodoroCountsInSession
          );
          setPomodorosUntilLongBreak(message.data.pomodorosUntilLongBreak);
        } else if (message.type === "toggle-timer-status") {
          setIsRunning(message.data.toggledTimerStatus);
          console.log(message.data.phase)
        }
      });
    })();
  }, [currentPhase]);

  const getDuration = async (phase: Phase): Promise<number> => {
    switch (phase) {
      case "focus":
        return (await getStorage(["pomodoroSeconds"])).pomodoroSeconds;
      case "break":
        return (await getStorage(["breakSeconds"])).breakSeconds;
      case "longBreak":
        return (await getStorage(["longBreakSeconds"])).longBreakSeconds;
    }
  };

  const expire = (): void => {
    setRemainingSeconds(0);
    closeTabs()
    chrome.runtime.sendMessage<Message>({ type: FromPopupMessageType.EXPIRE });
  };
  const pause = (): void => {
    chrome.runtime.sendMessage<Message>(
      { type: FromPopupMessageType.PAUSE },
      async () => {
        setIsRunning(false);
      }
    );
  };
  const resume = (): void => {
    chrome.runtime.sendMessage<Message>(
      { type: FromPopupMessageType.RESUME },
      async () => {
        setIsRunning(true);
      }
    );
  };

  const getCircleColor = (): string => {
    switch (currentPhase) {
      case "focus":
        return "#9BC7EC";
      case "break":
        return "#C7D9E9";
      case "longBreak":
        return "#C7D9E9";
      default:
        return "";
    }
  };

  const totalPomodoroCountMessage =
    translation.popup.totalPomodoroCount.replace(
      "%f",
      String(todayTotalPomodoroCount)
    );

  return (
    <div id="timerMenu">
      <Header />
      {!remainingSeconds ? (
        <div className="flex h-[22rem] w-full items-center justify-center">
          <LoadingSpinner />
        </div>
      ) : (
        <div className="ml-7 mt-3 flex items-center justify-center">
          {duration !== 0 && remainingSeconds !== 0 && (
            <div className="mr-4">
              <CountdownCircleTimer
                isPlaying={isRunning}
                duration={duration}
                initialRemainingTime={remainingSeconds}
                isSmoothColorTransition
                colors={getCircleColor() as ColorFormat}
                trailColor={COLOR.gray[200] as ColorFormat}               
              />
              <img
                src={Mascot}
                alt="Mascot"
                style={{
                  position: "absolute",
                  height:'110px',
                  // marginTop: '-55px',
                  // marginLeft:'45px',
                  // marginBottom:'150px',
                  top: '30%',
                  left: '28%',
                }}
              />
            </div>
          )}
        </div>
      )}

      <div className="ml-6 mt-2 flex items-center justify-center">
        <Countdown
          remainingSeconds={remainingSeconds}
          isRunning={isRunning}
          onToggleStatus={() => {
            isRunning ? pause() : resume();
          }}
          expire={expire}
        />
      </div>

      <div className="mt-6 flex items-center justify-center text-sm">
        {/* <span>{totalPomodoroCountMessage}</span>  */}
        <div className="ml-6 flex justify-center gap-1">
          <PomodoroCircles
            pomodorosUntilLongBreak={pomodorosUntilLongBreak}
            totalPomodoroCountInSession={totalPomodoroCountInSession}
          />
        </div>
        {/* <button
          className="ml-4 rounded-md px-1 text-lg hover:text-gray-300"
          onClick={expire}
        >
          <FastForward />
        </button> */}
      </div>
    </div>
  );
};

export default Timer;
