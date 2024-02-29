// import React from 'react';

// const BlockedOverlay = () => {
//   return (
//     <html lang="en">
//       <head>
//         <meta charset="UTF-8" />
//         <meta name="viewport" content="width=device-width, initial-scale=1.0" />
//         <title>Site Blocked</title>
//         <link href="https://fonts.googleapis.com/css2?family=YourSelectedFont&display=swap" rel="stylesheet" />
//       </head>
//       <body>
//         <h1>Site Blocked</h1>
//       </body>
//     </html>
//   );
// }

// export default BlockedOverlay;


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
// function generateSTYLING() {
//   return `
//     <style>
//       .overlay {
//         position: fixed;
//         top: 0;
//         left: 0;
//         width: 100%;
//         height: 100%;
//         background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black background */
//         display: flex;
//         justify-content: center;
//         align-items: center;
//         font-family: 'Noto Serif', serif;
//         z-index: 9999; /* Ensure the overlay appears on top of other content */
//       }
//       .overlay h1 {
//         font-size: 3em;
//         color: white;
//       }
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
//       ${generateSTYLING()} <!-- Include the generated styles -->
//     </head>
//     <body>
//       <div class="overlay">
//         <h1>Site Blocked</h1>
//       </div>
//     </body>
//     </html>
//   `;
// }


// export { generateHTML, generateSTYLING };
// Function to generate the HTML content for the blocked overlay
// function generateBlockedOverlay(): string {
//   return `
//     <!DOCTYPE html>
//     <html lang="en">
//     <head>
//       <meta charset="UTF-8">
//       <meta name="viewport" content="width=device-width, initial-scale=1.0">
//       <title>Site Blocked</title>
//       <link href="https://fonts.googleapis.com/css2?family=YourSelectedFont&display=swap" rel="stylesheet">
//       <style>
//         body {
//           display: flex;
//           justify-content: center;
//           align-items: center;
//           height: 100vh;
//           margin: 0;
//           background-color: rgba(0, 0, 0, 0.5);
//           font-family: 'Noto Serif', serif;
//         }
//         h1 {
//           font-size: 3em;
//           color: white;
//         }
//       </style>
//     </head>
//     <body>
//       <h1>Site Blocked</h1>
//     </body>
//     </html>
//   `;
// }
// export { generateBlockedOverlay };
export {};

// Listen for messages from the service worker
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'blockSite') {
    createBlockedOverlay();
    console.log("action received");
  }
});

function createBlockedOverlay() {
  console.log("creating overlay");
  // Create the blocked overlay here, for example:
  const blockedOverlay = document.createElement('div');
  blockedOverlay.textContent = 'This site is blocked!';
  blockedOverlay.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5);
    color: white;
    font-size: 24px;
    display: flex;
    justify-content: center;
    align-items: center;
  `;
  document.body.appendChild(blockedOverlay);
}
