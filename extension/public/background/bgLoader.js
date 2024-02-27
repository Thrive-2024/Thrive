// try {
//   // The load order of scripts. Not doing this and using javacript
//   // from the one of the imported scripts gives an error for some
//   // reason. Was unable to fix that, this is the solution
//   importScripts(
//     "/scripts/background/values.js",
//     "/scripts/background/utils.js",
//     "/scripts/background/index.js"
//   );
// } catch (e) {
//   console.error(e);
// }

/** To show the latest "time" for some time. ex: show 1:00 for 0.990 seconds before continuing */
const TIMER_PADDING = 990;
const ANGLE_DIFF_GENERATE_ICON = 5;

const SETTINGS = {
  sessionRounds: 4,
  sessionInputRangeStep: 1,
  sessionLength: {
    WORK: 25 * 60 * 1000 + TIMER_PADDING,
    BREAK: 5 * 60 * 1000 + TIMER_PADDING,
    LONG_BREAK: 15 * 60 * 1000 + TIMER_PADDING,
  },
  colors: {
    background: "#2E4057",
    gray: "#D8D4F2",

    WORK: "#0197F6",
    BREAK: "#70B77E",
    LONG_BREAK: "#EB5E28",
  },
};

const STATE = {
  isPaused: true,
  startTime: 0,
  pauseStartTime: 0,
  totalPausedTime: 0,
  currentPausedTime: 0, // used within background/index.js
  sessionType: "WORK", // 'WORK', 'BREAK', 'LONG_BREAK',
  sessionRound: 1,
  isFinished: false,
  dontShowNextPopup: false,

  get sessionLength() {
    return SETTINGS.sessionLength[this.sessionType];
  },
  get color() {
    return SETTINGS.colors[this.sessionType];
  },
  set sessionLength(_) {},
  set color(_) {},

  // ExtensionIcon
  currentExtensionIcon: "DEFAULT", // 'DEFAULT', 'PIE'

  softReset: function () {
    this.startTime = Date.now();
    this.pauseStartTime = Date.now();
    this.totalPausedTime = 0;
    this.currentPausedTime = 0;
    this.isFinished = false;
  },

  hardReset: function () {
    this.softReset();
    this.isPaused = true;
    this.sessionType = "WORK";
    this.sessionRound = 1;
    this.isFinished = false;
  },
};

// Doesnt actually need "BLOBS" reason, but is just there so "AUDIO_PLAYBACK" wont be suspended after 30 seconds
chrome.offscreen.createDocument({
  url: chrome.runtime.getURL("../../html/offscreen.html"),
  reasons: ["AUDIO_PLAYBACK", "BLOBS"],
  justification: "notification",
});

// ---------------------------------------------------------------------------------------------------------------------------------
// ADJUST CHROME EXTENSION ICON ----------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
let oldAngle = 0;

async function adjustExtensionToPieIconIfNecessary(timeLeft) {
  if (!timeLeft) {
    const elapsedTime = Date.now() - STATE.startTime - STATE.totalPausedTime;
    timeLeft = Math.max(STATE.sessionLength - elapsedTime, 0);
  }

  const newAngle = (timeLeft / STATE.sessionLength) * 360;
  const isAlreadyPi = STATE.currentExtensionIcon === "PIE";
  const isSmallAngleChange =
    Math.abs(oldAngle - newAngle) < ANGLE_DIFF_GENERATE_ICON;

  if (isAlreadyPi && isSmallAngleChange) return;

  oldAngle = newAngle;
  STATE.currentExtensionIcon = "PIE";

  const image = await sendMessage(
    "generate_extension_pie_icon",
    { iconAngle: newAngle, color: STATE.color },
    "offscreen"
  );
  chrome.action.setIcon({ path: image });
}


// Changes to the current default icon (shown when session is paused or finished).
// Does nothing if it is already that icon (with matching colors)

async function adjustExtensionToDefaultIconIfNecessary(sessionType, size) {
  STATE.currentExtensionIcon = "DEFAULT";
  const image = await sendMessage(
    "generate_extension_default_icon",
    { color: STATE.color, size },
    "offscreen"
  );
  chrome.action.setIcon({ path: image });
}

// ---------------------------------------------------------------------------------------------------------------------------------
// SEND MESSAGE TO popup / offscreen -----------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------

async function sendMessage(action, content, target = "popup") {
  const message = { action, content, target };
  console.log("[background] sending message to", target, "with action", action);

  try {
    return await new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
        } else {
          resolve(response);
        }
      });
    });
  } catch (e) {
    // Error only when popup not open; no error when popup open
    const popupNotOpenError =
      "The message port closed before a response was received.";
    if (e.message.includes(popupNotOpenError)) return;
    throw e;
  }
}

async function pushNotification(options) {
  if (STATE.dontShowNextPopup) {
    STATE.dontShowNextPopup = false;
    return;
  }

  const image = await sendMessage(
    "generate_extension_default_icon",
    { color: STATE.color, size: 128 },
    "offscreen"
  );
  sendMessage(
    "play_audio",
    "../../assets/sounds/notification.mp3",
    "offscreen"
  );
  chrome.notifications.create(
    "",
    {
      type: "basic",
      title: options.title,
      iconUrl: image,
      message: options.message,
    },
    (_) => {}
  );
}

// ---------------------------------------------------------------------------------------------------------------------------------
// USING chrome.storage.local ------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
async function setStorage(key, value) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.set({ [key]: value }, () => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve();
      }
    });
  });
}

function getStorage(key) {
  return new Promise((resolve, reject) => {
    chrome.storage.local.get([key], (result) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve(result[key]);
      }
    });
  });
}

// ---------------------------------------------------------------------------------------------------------------------------------
// GENERAL -------------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
function durationToString(duration, options = { isVerbose: true }) {
  const hours = Math.floor(duration / 1000 / 60 / 60);
  const minutes = Math.floor(duration / 1000 / 60) % 60;
  const seconds = Math.floor(duration / 1000) % 60;

  const parts = [];
  if (options.isVerbose) {
    if (hours > 0) parts.push(`${hours} hour${hours > 1 ? "s" : ""}`);
    if (minutes > 0) parts.push(`${minutes} minute${minutes > 1 ? "s" : ""}`);
    if (seconds > 0) parts.push(`${seconds} second${seconds > 1 ? "s" : ""}`);

    return parts.join(" ");
  } else {
    if (hours) parts.push(String(hours).padStart(2, "0"));
    parts.push(String(minutes).padStart(2, "0"));
    parts.push(String(seconds).padStart(2, "0"));

    return parts.join(" : ");
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------
// INITIALIZE VALUES ---------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
/** Inidicates if all values are initialized. To wait, use the `ensureInitialized()` function */
let INITIALIZED = false;
(async () => {
  Object.assign(SETTINGS, await getStorage("SETTINGS"));
  Object.assign(STATE, {
    isPaused: true,
    startTime: Date.now(),
    pauseStartTime: Date.now(),
    totalPausedTime: 0,
    currentPausedTime: 0,
    sessionType: "WORK", // 'WORK', 'BREAK',
    sessionRound: 1,
  });

  INITIALIZED = true;

  // chrome.action.setIcon({ path: "../../something.png" });
})();

/** Waits until all values are initialized */
async function ensureInitialized() {
  while (!INITIALIZED) {
    await new Promise((resolve) => setTimeout(resolve, 5));
  }
}

// ---------------------------------------------------------------------------------------------------------------------------------
// MAIN LOOP -----------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
setInterval(() => {
  if (!INITIALIZED) return;

  if (STATE.isPaused) {
    STATE.currentPausedTime = Date.now() - STATE.pauseStartTime;
    return;
  }

  const elapsedTime = Date.now() - STATE.startTime - STATE.totalPausedTime;
  const timeLeft = Math.max(STATE.sessionLength - elapsedTime, 0);

  adjustExtensionToPieIconIfNecessary(timeLeft);

  // Change session type, as finished current session
  if (timeLeft <= 0) {
    switch (STATE.sessionType) {
      case "WORK":
        if (STATE.sessionRound >= SETTINGS.sessionRounds) {
          STATE.isPaused = true;
          STATE.isFinished = true;
          adjustExtensionToDefaultIconIfNecessary(STATE.sessionType, 32);
          pushNotification({
            title: `All session rounds completed`,
            message: `Finished a total of ${SETTINGS.sessionRounds} rounds`,
          });
        } else {
          STATE.sessionType = "BREAK";
          pushNotification({
            title: `Focus time finished`,
            message: `Completed work round ${STATE.sessionRound} / ${SETTINGS.sessionRounds}. Take a break`,
          });
        }
        break;
      case "BREAK":
        STATE.sessionType = "WORK";
        STATE.sessionRound++;
        pushNotification({
          title: `Break time finished`,
          message: `Starting work session ${STATE.sessionRound} / ${SETTINGS.sessionRounds}`,
        });
        break;
      default:
        break;
    }

    if (!STATE.isFinished) {
      STATE.softReset();
    }
    else {
      STATE.hardReset();
    }
    sendMessage("update_state", STATE, "popup");
  }
}, 50);

// ---------------------------------------------------------------------------------------------------------------------------------
// EVENTS MESSAGES -----------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
// message = { action, content }
chrome.runtime.onMessage.addListener(receiveMessage);
function receiveMessage(message, sender, sendResponse) {
  if (message.target !== "background") return;

  if (message.action !== "log" && message.action !== "error") {
    console.log(`[background] received message with action ${message.action}`);
  }

  (async () => {
    await ensureInitialized();
    switch (message.action) {
      case "get_settings":
        sendResponse(SETTINGS);
        break;
      case "get_state":
        sendResponse(STATE);
        break;
      case "update_settings":
        Object.assign(SETTINGS, message.content);
        await setStorage("SETTINGS", SETTINGS);
        STATE.softReset();
        sendResponse();
        break;
      case "update_state":
        Object.assign(STATE, message.content);
        sendResponse();
        break;
      case "toggle_play_pause":
        if (STATE.isFinished) {
          sendResponse();
          break;
        }

        if (STATE.isPaused == false) {
          STATE.pauseStartTime = Date.now();
          STATE.isPaused = true;
          await adjustExtensionToDefaultIconIfNecessary(STATE.sessionType, 32);
        } else {
          STATE.totalPausedTime += Date.now() - STATE.pauseStartTime;
          STATE.pauseStartTime = 0;
          STATE.isPaused = false;
          adjustExtensionToPieIconIfNecessary();
        }
        STATE.currentPausedTime = 0;
        sendResponse();
        break;
      case "skip_session":
        if (STATE.isFinished) {
          sendResponse();
          break;
        }

        STATE.softReset();
        STATE.startTime = Date.now() - STATE.sessionLength - 1000;
        STATE.dontShowNextPopup = true;
        STATE.isPaused = false;

        sendResponse();
        break;
      case "reset_timer":
        if (message.content.hard) {
          STATE.hardReset();
          await adjustExtensionToDefaultIconIfNecessary(STATE.sessionType, 32);
        } else STATE.softReset();
        sendResponse();
        break;
      case "log":
        // For debugging
        console.log(message.content);
        sendResponse();
        break;
      case "error":
        // For debugging
        console.error(message.content);
        sendResponse();
        break;
      default:
        sendResponse();
        break;
    }
  })();

  return true;
}
