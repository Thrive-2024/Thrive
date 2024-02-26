// Main initialization
(async () => {
  // initialize settings values and page
  const [settings, state] = await Promise.all([
    sendMessage("get_settings"),
    sendMessage("get_state"),
  ]);

  Object.assign(SETTINGS, settings);
  Object.assign(STATE, state);

  // Using `SETTINGS`, adjusts the settings ui and adds event listeners to each input

  adjustUiToState();
  function updateTimerUi() {
    if (STATE.isFinished) return requestAnimationFrame(updateTimerUi);
    if (STATE.isPaused)
      STATE.currentPausedTime = Date.now() - STATE.pauseStartTime;

    adjustUiToState();
    return requestAnimationFrame(updateTimerUi);
  }
  updateTimerUi();
})();

/**
 * Adjusts the ui (e.g. color, circle arc, time left, and so on)
 */
function adjustUiToState() {
  let timeLeft;
  if (STATE.isFinished) timeLeft = 0;
  else {
    const elapsedTime =
      Date.now() -
      STATE.startTime -
      STATE.totalPausedTime -
      STATE.currentPausedTime;
    timeLeft = Math.max(STATE.sessionLength - elapsedTime, 0);
  }

  adjustCurrentSessionColor(STATE.sessionType);
  adjustCircleArc(timeLeft / STATE.sessionLength);
  adjustTimerSessionType(STATE.sessionType);
  adjustTimerTimeLeft(timeLeft);
  adjustPlayPauseButton(STATE.isPaused);
  adjustSessionRound(STATE.sessionRound, SETTINGS.sessionRounds);
}

// ---------------------------------------------------------------------------------------------------------------------------------
// EVENTS MESSAGES -----------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
// message = { action, content }
chrome.runtime.onMessage.addListener(receiveMessageFromBackground);
function receiveMessageFromBackground(message, sender, sendResponse) {
  if (message.target !== "popup") return;
  console.log(`[popup] received message with action ${message.action}`);

  (async () => {
    switch (message.action) {
      case "update_state":
        Object.assign(STATE, message.content);
        sendResponse();
        break;
      default:
        sendResponse();
        break;
    }
  })();

  return true;
}
