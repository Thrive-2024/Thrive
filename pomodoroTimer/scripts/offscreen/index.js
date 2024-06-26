// ---------------------------------------------------------------------------------------------------------------------------------
// KEEP BACKGROUND SERVICE WORKER ALIVE --------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
setInterval(async () => sendMessage("keep_alive", "", "background"), 20e3);

// ---------------------------------------------------------------------------------------------------------------------------------
// LISTEN TO MESSAGES --------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
chrome.runtime.onMessage.addListener(receiveMessageFromBackground);
function receiveMessageFromBackground(message, sender, sendResponse) {
  if (message.target !== "offscreen") return;

  (async () => {
    if (message.action !== "generate_extension_pie_icon") {
      await sendMessage(
        "log",
        `[offscreen] received message with action ${message.action}`,
        "background"
      );
    }
    switch (message.action) {
      case "play_audio":
        const audioTag = document.getElementById("audioTag");
        const audioSource = document.getElementById("audioSource");
        audioSource.src = message.content;
        audioTag.load();
        audioTag.play();
        sendResponse();
        break;
      case "generate_extension_pie_icon":
        const { iconAngle, color, size: pieSize } = message.content;
        const image = await generateExtensionPieIcon(iconAngle, color, pieSize);
        sendResponse(image);
        break;
      case "generate_extension_default_icon":
          // Fetch the image icon from the local assets
          const response = await fetch('../assets/icons/128.png');
          const blob = await response.blob();
      
          // Convert the blob to a data URL
          const reader = new FileReader();
          reader.readAsDataURL(blob);
          reader.onloadend = () => {
            const defaultImage = reader.result;
            sendResponse(defaultImage);
          };
          break;
      default:
        sendResponse();
        break;
    }
  })();

  return true;
}

// ---------------------------------------------------------------------------------------------------------------------------------
// SEND A MESSAGE ------------------------------------------------------------------------------------------------------------------
// ---------------------------------------------------------------------------------------------------------------------------------
/**
 * Sends a message using the Chrome extension messaging API and returns a Promise.
 *
 * @param {string} action - Action, such as `keep_alive`
 * @param {*} content - The payload of the message, if any.
 * @param {"background" | "offscreen"} target
 */
async function sendMessage(action, content, target = "background") {
  const message = { action, content, target };
  console.log("[popup] sending message to", target, "with action", action);

  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(message, (response) => {
      if (chrome.runtime.lastError) {
        reject(new Error(chrome.runtime.lastError.message));
      } else {
        resolve(response);
      }
    });
  });
}
