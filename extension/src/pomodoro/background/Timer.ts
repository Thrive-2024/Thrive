import dayjs from "dayjs";
import { StorageValue, Phase, DailyPomodoro, Message } from "../types";
import { getStorage, runtime, setStorage } from "../utils/chrome";
import { updateSecondsOfBadge, updateColorOfBadge } from "./Action";
import { closeTabs, openNewTab } from "./Tab";
import { createNotificationContent, sendNotification } from "./Notification";
import keepAlive from "../utils/keepAliveServiceWorker";
import { FromServiceWorkerMessageType } from "../utils/message";
import { extractTodayPomodoroCount } from "../utils/pomodoroHelper";
import { REACT_APP_BACKEND_DEV_URL } from "../../constants/envConsts";

let intervalId = 0;

const toggleTimerStatus = async (needSendMessage = false): Promise<void> => {
  await keepAlive();

  getStorage([
    "remainingSeconds",
    "phase",
    "isRunning",
    "totalPomodoroCountsInSession",
  ]).then(async (data: StorageValue) => {
    try {
      if (data.isRunning) {
        await pauseTimer();
      } else {
        await closeTabs();
        await resumeTimer();
      }
      if (needSendMessage) {
        await runtime.sendMessage<Message>({
          type: FromServiceWorkerMessageType.TOGGLE_TIMER_STATUS,
          data: {
            toggledTimerStatus: !data.isRunning,
          },
        });
      }
    } catch (e) {
      console.error(e);
    }
  });
};

const setTickInterval = (isRunning: boolean): void => {
  if (isRunning) {
    intervalId = Number(setInterval(handleCountDown, 1000));
  } else {
    clearInterval(intervalId);
    intervalId = 0;
  }
};

const handleCountDown = (): void => {
  getStorage(["remainingSeconds"]).then(async (data: StorageValue) => {
    if (data.remainingSeconds > 0) {
      await reduceCount(data.remainingSeconds);
    }

    if (data.remainingSeconds === 1) {
      const {
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodorosUntilLongBreak,
      } = await getStorage([
        "phase",
        "totalPomodoroCountsInSession",
        "dailyPomodoros",
        "pomodorosUntilLongBreak",
      ]);
      await expire(
        phase,
        totalPomodoroCountsInSession,
        dailyPomodoros,
        pomodorosUntilLongBreak
      );
    }
  });
};

const reduceCount = async (remainingSeconds: number): Promise<void> => {
  try {
    setStorage({ remainingSeconds: remainingSeconds - 1 });
    await updateSecondsOfBadge(remainingSeconds - 1);
    await runtime.sendMessage<Message>({
      type: FromServiceWorkerMessageType.REDUCE_COUNT,
      data: {
        secs: remainingSeconds - 1,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const updateTimeTrack = async (
  email: string,
  year: number,
  month: number,
  day: number,
  durationDay: number,
  lastTask: string,
) => {
  try {
    const updateTimeResponse = await fetch(
      // `http://localhost:8000/api/motivation/randomMessageFromSystem?receiver=james@gmail.com`,
      `${REACT_APP_BACKEND_DEV_URL}/miscellaneous/updateTimeTracked`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          email: email,
          year: year,
          month: month,
          day: day,
          durationDay: durationDay,
          lastTask: lastTask,
        }),
      }
    );

    if (updateTimeResponse.status != 200) {
      console.log("ERROR UPDATING TIME");
      const apiResponse = await updateTimeResponse.json();
      console.log(apiResponse);
    } else {
      const apiResponse = await updateTimeResponse.json();
      console.log(apiResponse);
    }

    const updateSessionResponse = await fetch(
      // `http://localhost:8000/api/motivation/randomMessageFromSystem?receiver=james@gmail.com`,
      `${REACT_APP_BACKEND_DEV_URL}/miscellaneous/updateSession`,
      {
        headers: {
          "Content-Type": "application/json",
        },
        method: "PUT",
        body: JSON.stringify({
          email: email,
          year: year,
          month: month,
          day: day,
          numOfSession: 1,
        }),
      }
    );

    if (updateSessionResponse.status != 200) {
      console.log("ERROR UPDATING TIME");
      const apiResponse = await updateSessionResponse.json();
      console.log(apiResponse);
    } else {
      const apiResponse = await updateSessionResponse.json();
      console.log(apiResponse);
    }
  } catch (err) {
    console.log("ERROR UPDATING TIME");
    return null;
  }
};

const expire = async (
  phase: Phase,
  totalPomodoroCountsInSession: number,
  dailyPomodoros: DailyPomodoro[],
  pomodorosUntilLongBreak: number,
  isAutoExpire = true
): Promise<void> => {
  let remainingSeconds = 0;
  let nextPhase: Phase = "focus";

  try {
    await updateTimerLength(phase);

    if (phase === "focus") {
      totalPomodoroCountsInSession++;
      if (totalPomodoroCountsInSession >= pomodorosUntilLongBreak) {
        remainingSeconds = await (
          await getStorage(["longBreakSeconds"])
        ).longBreakSeconds;
        totalPomodoroCountsInSession = 0;
        nextPhase = "longBreak";
      } else {
        remainingSeconds = await (
          await getStorage(["breakSeconds"])
        ).breakSeconds;
        nextPhase = "break";
      }
      dailyPomodoros = increaseDailyPomodoro(dailyPomodoros);
    } else {
      remainingSeconds = await (
        await getStorage(["pomodoroSeconds"])
      ).pomodoroSeconds;
    }
    const todayTotalPomodoroCount = extractTodayPomodoroCount(dailyPomodoros);

    setStorage({
      remainingSeconds,
      phase: nextPhase,
      totalPomodoroCountsInSession,
      isRunning: false,
      dailyPomodoros,
      isTimerStarted: false,
    });
    await updateSecondsOfBadge(remainingSeconds);
    await updateColorOfBadge(nextPhase);

    if (isAutoExpire) {
      getStorage([
        "pomodoroSeconds",
        "showDesktopNotificationWhenBreak",
        "showDesktopNotificationWhenPomodoro",
        "showNewTabNotificationWhenBreak",
        "showNewTabNotificationWhenPomodoro",
      ]).then(async (data: StorageValue) => {
        const {
          pomodoroSeconds,
          showDesktopNotificationWhenBreak,
          showDesktopNotificationWhenPomodoro,
          showNewTabNotificationWhenBreak,
          showNewTabNotificationWhenPomodoro,
        } = data;

        if (phase === "focus") {
          let currentUser = "";
          getStorage(["currentUser"]).then((value: StorageValue) => {
            currentUser = value.currentUser;
          });

          const today = dayjs();
          const year = today.year();
          const month = today.month() + 1;
          const day = today.date();

          const data = await new Promise<{ selectedTask: string }>((resolve) => {
            chrome.storage.sync.get("selectedTask", (data) => {
              resolve({ selectedTask: data.selectedTask.taskName });
            });
          });

          updateTimeTrack(currentUser, year, month, day, pomodoroSeconds/60, data.selectedTask);
          if (showDesktopNotificationWhenPomodoro) {
            const [title, message] = await createNotificationContent(
              phase,
              todayTotalPomodoroCount,
              pomodorosUntilLongBreak - totalPomodoroCountsInSession
            );
            sendNotification(title, message);
          }
          if (showNewTabNotificationWhenPomodoro) {
            openNewTab();
          }
        } else {
          if (showDesktopNotificationWhenBreak) {
            const [title, message] = await createNotificationContent(
              phase,
              todayTotalPomodoroCount,
              pomodorosUntilLongBreak - totalPomodoroCountsInSession
            );
            sendNotification(title, message);
          }
          if (showNewTabNotificationWhenBreak) {
            openNewTab();
          }
        }
      });
    }
    setTickInterval(false);

    await runtime.sendMessage<Message>({
      type: FromServiceWorkerMessageType.EXPIRE,
      data: {
        secs: remainingSeconds,
        phase: nextPhase,
        todayTotalPomodoroCount,
        totalPomodoroCountsInSession,
        pomodorosUntilLongBreak,
      },
    });
  } catch (e) {
    console.error(e);
  }
};

const updateTimerLength = async (phase: Phase): Promise<void> => {
  if (phase === "focus") {
    const updatingPomodoroSeconds = await (
      await getStorage(["updatingPomodoroSeconds"])
    ).updatingPomodoroSeconds;
    if (updatingPomodoroSeconds !== 0) {
      setStorage({
        pomodoroSeconds: updatingPomodoroSeconds,
        updatingPomodoroSeconds: 0,
      });
    }
  } else if (phase === "break") {
    const updatingBreakSeconds = await (
      await getStorage(["updatingBreakSeconds"])
    ).updatingBreakSeconds;
    if (updatingBreakSeconds !== 0) {
      setStorage({
        breakSeconds: updatingBreakSeconds,
        updatingBreakSeconds: 0,
      });
    }
  } else if (phase === "longBreak") {
    const updatingLongBreakSeconds = await (
      await getStorage(["updatingLongBreakSeconds"])
    ).updatingLongBreakSeconds;
    if (updatingLongBreakSeconds !== 0) {
      setStorage({
        longBreakSeconds: updatingLongBreakSeconds,
        updatingLongBreakSeconds: 0,
      });
    }
  }
};

const increaseDailyPomodoro = (
  dailyPomodoros: DailyPomodoro[]
): DailyPomodoro[] => {
  const today = dayjs();
  const year = today.year();
  const month = today.month() + 1;
  const day = today.date();

  const lastPomodoroDate = dailyPomodoros.slice(-1);
  if (lastPomodoroDate.length > 0) {
    if (
      lastPomodoroDate[0].year === year &&
      lastPomodoroDate[0].month === month &&
      lastPomodoroDate[0].day === day
    ) {
      dailyPomodoros.slice(-1)[0].count++;
      return dailyPomodoros;
    }
  }
  dailyPomodoros.push({
    year,
    month,
    day,
    count: 1,
  });

  return dailyPomodoros;
};

const resumeTimer = async (): Promise<void> => {
  setStorage({ isRunning: true });
  getStorage(["isTimerStarted"]).then(({ isTimerStarted }) => {
    if (!isTimerStarted) {
      setStorage({ isTimerStarted: true });
    }
  });
  setTickInterval(true);
};

const pauseTimer = async (): Promise<void> => {
  setStorage({ isRunning: false });
  setTickInterval(false);
};

export {
  toggleTimerStatus,
  handleCountDown,
  expire,
  reduceCount,
  resumeTimer,
  pauseTimer,
};
