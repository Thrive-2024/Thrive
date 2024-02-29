// let restricted_sites = new Set();

// // SY EDITS: how to check the on or off of the extension
// // Retrieve the current state of the extension (whether it's on or off)
// let isExtensionOn = false;
// chrome.storage.sync.get("isExtensionOn", function (data) {
//   isExtensionOn = data.isExtensionOn !== undefined ? data.isExtensionOn : false;
//   // Check if the extension is turned on when the page loads
//   if (isExtensionOn) {
//     check_if_restricted();
//   }
// });

// // Retrieve the blockedWebsitesArray from Chrome storage
// chrome.storage.sync.get("blockedWebsitesArray", function (data) {
//   const blockedWebsitesArray = data.blockedWebsitesArray || [];
//   if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
//     // Add the items from blockedWebsitesArray to the set restricted_sites to avoid duplicates
//     blockedWebsitesArray.forEach((item: string) => {
//       // Convert to lowercase and add both versions of the URL
//       restricted_sites.add(item.toLowerCase());
//       restricted_sites.add(normalizeURL(item.toLowerCase()));
//     });

//     // Call the function to check if the website should be blocked
//     check_if_restricted();
//   }
// });

// // Normalize URL by removing 'www.' from the beginning
// function normalizeURL(url: string) {
//   return url.replace(/^www\./i, "");
// }

// // Check if the current website should be blocked
// function shouldBlockWebsite() {
//   const currentHostname = normalizeURL(window.location.hostname);
//   return restricted_sites.has(currentHostname);
// }

// // Create the blocked page dynamically
// function createBlockedPage() {
//   const blockedPage = generateHTML();
//   const style = generateSTYLING();
//   // Inject the styles and blocked page into the current document
//   const head = document.head || document.getElementsByTagName("head")[0];
//   head.insertAdjacentHTML("beforeend", style);
//   document.body.innerHTML = blockedPage;
// }

// // Check if the website should be blocked and take appropriate action
// function check_if_restricted() {
//   if (isExtensionOn && shouldBlockWebsite()) {
//     createBlockedPage();
//   }
// }

// function generateSTYLING() {
//   return `
//     <style>
//     body {
//       display: flex !important;
//       justify-content: center !important;
//       height: 100vh !important;
//       margin: 0 !important;
//       background-color: #174b42 !important;
//       font-family: 'Noto Serif', serif !important;
//     }
//     h1 {
//       font-size: 3em !important;
//       margin-top: 20vh !important;
//       color: white !important;
//     }
//     </style>
//   `;
// }

// function generateHTML() {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Site Blocked</title>
//       <link href="https://fonts.googleapis.com/css2?family=YourSelectedFont&display=swap" rel="stylesheet">
//     </head>
//     <body>
//       <h1>Site Blocked</h1>
//     </body>
//     </html>
//   `;
// // }
// import { generateHTML, generateSTYLING } from "./BlockedPage";

// let restrictedSites = new Set<string>();
// let isExtensionOn = false;

// chrome.runtime.onInstalled.addListener(() => {
//   // Initialize extension
//   init();
//   console.log("initialised")
// });

// async function init() {
//   try {
//     // Retrieve extension state and restricted sites from storage
//     const storageData = await getStorageData();
//     const isExtensionOn = storageData.isExtensionOn;
    
//     // Send message to content script to block websites if extension is on
//     if (isExtensionOn) {
//       chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
//         const tabId = tabs[0]?.id;

//         console.log("query tabId", tabId)
//         if (tabId) {
//           console.log("trying to send message")
//           chrome.tabs.sendMessage(tabId, { action: 'blockWebsites', blockedSites: storageData.blockedWebsitesArray });
//         }
//       });
//     }
//   } catch (error) {
//     console.error("Error initializing extension:", error);
//   }
// }

// async function getStorageData() {
//   return new Promise<{ isExtensionOn: boolean, blockedWebsitesArray: string[] }>((resolve, reject) => {
//     chrome.storage.sync.get(["isExtensionOn", "blockedWebsitesArray"], (data) => {
//       if (chrome.runtime.lastError) {
//         reject(chrome.runtime.lastError);
//       } else {
//         resolve({
//           isExtensionOn: data.isExtensionOn !== undefined ? data.isExtensionOn : false,
//           blockedWebsitesArray: data.blockedWebsitesArray || []
//         });
//       }
//     });
//   });
// }

// chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {

//   console.log("message received")
//   if (message.action === 'blockWebsites') {
//     if (shouldBlockWebsite()) {
//       console.log("trying to block page")
//       createBlockedPage();
//       console.log("created block page")
//     }
//   }
// });

// function addRestrictedSites(sites: string[]) {
//   sites.forEach(site => {
//     const normalizedSite = normalizeURL(site.toLowerCase());
//     restrictedSites.add(normalizedSite);
//   });
// }

// function normalizeURL(url: string) {
//   return url.replace(/^www\./i, "");
// }

// function shouldBlockWebsite() {
//   const currentHostname = normalizeURL(window.location.hostname);
//   console.log("current Hostname: ", currentHostname)
//   return restrictedSites.has(currentHostname);
// }

// function createBlockedPage() {
//   const blockedPage = generateHTML();
//   const style = generateSTYLING();
//   // Inject the styles and blocked page into the current document
//   const head = document.head || document.getElementsByTagName("head")[0];
//   head.insertAdjacentHTML("beforeend", style);
//   document.body.innerHTML = blockedPage;
// }

export {};

let restrictedSites: Set<string> = new Set();
let isExtensionOn: boolean = false;

// Initialize the extension
init();

// Listen for tab activation events
chrome.tabs.onActivated.addListener(async (activeInfo) => {
  console.log("activated")
  await init();
  await checkTabForBlockedSite(activeInfo.tabId);
});

async function init(): Promise<void> {
  try {
    // Retrieve extension state and restricted sites from storage
    const storageData = await getStorageData();
    isExtensionOn = storageData.isExtensionOn;
    addRestrictedSites(storageData.blockedWebsitesArray);
  } catch (error) {
    console.error("Error initializing extension:", error);
  }
}

async function getStorageData(): Promise<{ isExtensionOn: boolean; blockedWebsitesArray: string[] }> {
  return new Promise((resolve, reject) => {
    chrome.storage.sync.get(["isExtensionOn", "blockedWebsitesArray"], (data) => {
      if (chrome.runtime.lastError) {
        reject(chrome.runtime.lastError);
      } else {
        resolve({
          isExtensionOn: data["isExtensionOn"] !== undefined ? data["isExtensionOn"] : false,
          blockedWebsitesArray: data["blockedWebsitesArray"] || [],
        });
      }
    });

    console.log("isExtensionOn ", isExtensionOn)
    console.log("restrictedSites ", restrictedSites)
  });
}

function addRestrictedSites(sites: string[]): void {
  sites.forEach(site => {
    const normalizedSite = normalizeURL(site.toLowerCase());
    restrictedSites.add(normalizedSite);
  });

  console.log("all the restricted sites", restrictedSites)
}

// async function checkTabForBlockedSite(tabId: number): Promise<void> {
//   const tab = await getTabInfo(tabId);
//   if (tab && tab.url) { // Check if tab and tab.url are defined
//     const currentHostname = normalizeURL(tab.url);
//     console.log("currentHostname", currentHostname);
//     console.log("checking if should be blocked", shouldBlockWebsite(currentHostname))
//     if (isExtensionOn && shouldBlockWebsite(currentHostname)) {
//       console.log("creating blocked page")
//       injectBlockedOverlay();
//     }
//   }
// }
// Send a message to the content script to inform it that a blocked site has been detected
// async function informContentScript(tabId: number): Promise<void> {
//   const message = { action: 'blockSite' };
//   chrome.tabs.sendMessage(tabId, message);
// }

// async function checkTabForBlockedSite(tabId: number): Promise<void> {
//   const tab = await getTabInfo(tabId);
//   if (tab && tab.url) {
//     const currentHostname = normalizeURL(tab.url);
//     if (isExtensionOn && shouldBlockWebsite(currentHostname)) {
//       informContentScript(tabId); // Inform the content script
//     }
//   }
// }
// Check if the tab should be blocked
async function checkTabForBlockedSite(tabId: number): Promise<void> {
  const tab = await getTabInfo(tabId);
  if (tab && tab.url) {
    const currentHostname = normalizeURL(tab.url);
        console.log("currentHostname", currentHostname);
        console.log("checking if should be blocked", shouldBlockWebsite(currentHostname))
    if (isExtensionOn && shouldBlockWebsite(currentHostname)) {
      // Send message to content script to block the site
      console.log("to block, sending signal")
      chrome.tabs.sendMessage(tabId, { action: 'blockSite' });
    }
  }
}

async function getTabInfo(tabId: number): Promise<chrome.tabs.Tab | undefined> {
  return new Promise((resolve) => {
    chrome.tabs.get(tabId, (tab) => {
      resolve(tab);
    });
  });
}

// function normalizeURL(url: string): string {
//   return url.replace(/^www\./i, "");
// }
function normalizeURL(url: string): string {
  // Remove 'http://' or 'https://', if present
  let hostname = url.replace(/^(https?:\/\/)?(www\.)?/, '');
  // Remove any path or query parameters
  const pathIndex = hostname.indexOf('/');
  if (pathIndex !== -1) {
    hostname = hostname.substring(0, pathIndex);
  }
  // Remove any port numbers
  const portIndex = hostname.indexOf(':');
  if (portIndex !== -1) {
    hostname = hostname.substring(0, portIndex);
  }
  return hostname;
}

function shouldBlockWebsite(hostname: string): boolean {
  return restrictedSites.has(hostname);
}

// function createBlockedPage(): void {
//   const blockedPage = generateHTML();
//   const style = generateSTYLING();
//   // Inject the styles and blocked page into the current document
//   const head = document.head || document.getElementsByTagName("head")[0];
//   head.insertAdjacentHTML("beforeend", style);
//   document.body.innerHTML = blockedPage;
// }
// function createBlockedPage(): void {
//   const blockedPage = generateHTML();
//   const style = generateSTYLING();
  
//   console.log("generating")
//   // Inject the styles into the current tab's document
//   const styleElement = document.createElement('style');
//   styleElement.innerHTML = style;
//   document.head.appendChild(styleElement);

//   // Create a div for the blocked overlay
//   const overlayDiv = document.createElement('div');
//   overlayDiv.classList.add('overlay');
//   overlayDiv.innerHTML = blockedPage;

//   // Inject the overlay into the current tab's document body
//   document.body.appendChild(overlayDiv);
// }
// function createBlockedPage(): void {
//     console.log("generating")
//   const blockedPage = generateHTML();
//   const style = generateSTYLING();

//   // Check if the document object is available
//   if (document && document.head && document.body) {
//     // Inject the styles and blocked page into the current document
//     const head = document.head;
//     head.insertAdjacentHTML("beforeend", style);
//     document.body.innerHTML = blockedPage;
//   } else {
//     console.error("Document object or its properties are not available.");
//   }
// }
// function injectBlockedOverlay(): void {
//   const blockedOverlay = generateBlockedOverlay();

//   console.log("generating overlay")

//   // Create a new div element
//   const overlayDiv = document.createElement('div');
//   overlayDiv.id = 'blocked-overlay';
//   overlayDiv.innerHTML = blockedOverlay;

//   // Append the div to the body
//   document.body.appendChild(overlayDiv);
// }

