export { };

const restricted_sites = new Set();

// SY EDITS: how to check the on or off of the extension
// Retrieve the current state of the extension (whether it's on or off)
let isExtensionOn = false;
chrome.storage.sync.get("isExtensionOn", function (data) {
  isExtensionOn = data.isExtensionOn !== undefined ? data.isExtensionOn : false;
  // Check if the extension is turned on when the page loads
  if (isExtensionOn) {
    check_if_restricted();
  }
});

// Retrieve the blockedWebsitesArray from Chrome storage
chrome.storage.sync.get("blockedWebsitesArray", function (data) {
  const blockedWebsitesArray = data.blockedWebsitesArray || [];
  if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
    // Add the items from blockedWebsitesArray to the set restricted_sites to avoid duplicates
    blockedWebsitesArray.forEach((item: string) => {
      // Convert to lowercase and add both versions of the URL
      restricted_sites.add(item.toLowerCase());
      restricted_sites.add(normalizeURL(item.toLowerCase()));
    });

    // Call the function to check if the website should be blocked
    check_if_restricted();
  }
});

// Normalize URL by removing 'www.' from the beginning
function normalizeURL(url: string) {
  return url.replace(/^www\./i, "");
}

// Check if the current website should be blocked
function shouldBlockWebsite() {
  const currentHostname = normalizeURL(window.location.hostname);
  return restricted_sites.has(currentHostname);
}

// Create the blocked page dynamically
function createBlockedPage() {
  const blockedPage = generateHTML();
  const style = generateSTYLING();
  // Inject the styles and blocked page into the current document
  const head = document.head || document.getElementsByTagName("head")[0];
  head.insertAdjacentHTML("beforeend", style);
  document.body.innerHTML = blockedPage;
}

// Check if the website should be blocked and take appropriate action
function check_if_restricted() {
  if (isExtensionOn && shouldBlockWebsite()) {
    createBlockedPage();
  }
}

function generateSTYLING() {
  return `
    <style>
    body {
      display: flex !important;
      justify-content: center !important;
      align-items: center !important;
      height: 100vh !important;
      margin: 0 !important;
      background-color: #F5F5F4 !important;
      font-family: Roboto, Helvetica, Arial, sans-serif !important;
      z-index: 9999 !important;
    }
    h1 {
      font-size: 4em !important;
      color: #1c1c1c !important;
      margin-right: 48px !important; 
    }
    h2 {
      font-size: 3em !important;
      color: #1c1c1c !important;
      margin-right: 48px !important; 
    }
    h3 {
      font-size: 2em !important;
      color: #686b69 !important;
      text-wrap: wrap !important;
      margin-right: 48px !important; 
    }
    img{
      margin:48px !important;
      height:256px !important;
    }
    
    .text-container {
      display: flex;
      flex-direction: column;
    }
    </style>
  `;
}

function generateHTML() {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Site Blocked</title>
      <link href="https://fonts.googleapis.com/css2?family=YourSelectedFont&display=swap" rel="stylesheet">
    </head>
    <body>
      <img src="${chrome.runtime.getURL("src/siteBlocker/background/mascot.png")}" alt="Dive Image">
      <div id="text-container">
        <h1>Oh No! Dive blocked this site!</h1>
        <h2>You tried to open a tab that you restricted.</h1>
        <h3>If you need to access this site, remove it from your restricted sites and refresh the page.</h3>
      </div>
    </body>
    </html>
  `;
}
