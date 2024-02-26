// popup scripts control the behavior of the extension's popup window

window.onload = function () {
  updateBlockedWebsitesSection();
  var blockButton = document.getElementById("blockButton");
  blockButton.onclick = function () {
    getWebsiteInput();
  };
};

//SY EDITS: function to edit the message pop up
function showError(message) {
  const errorContainer = document.getElementById("errorContainer");
  errorContainer.textContent = message;
}

// SY EDITS: turn on and off button
// Retrieve the current state of the extension (whether it's on or off)
let isExtensionOn = true;
chrome.storage.sync.get("isExtensionOn", function (data) {
  isExtensionOn = data.isExtensionOn !== undefined ? data.isExtensionOn : false;
  updateToggleButton();
});

// Toggle the state of the extension and update the button text accordingly
function toggleExtensionState() {
  isExtensionOn = !isExtensionOn;
  chrome.storage.sync.set({ "isExtensionOn": isExtensionOn });
  updateToggleButton();
}

// Update the button text based on the current extension state
function updateToggleButton() {
  const toggleButton = document.getElementById("toggleButton");
  if (isExtensionOn) {
    toggleButton.textContent = "Turn Off";
    toggleButton.classList.remove("off");
    toggleButton.classList.add("on");
  } else {
    toggleButton.textContent = "Turn On";
    toggleButton.classList.remove("on");
    toggleButton.classList.add("off");
  }
}

// Add click event listener to the toggle button
document.addEventListener("DOMContentLoaded", function () {
  const toggleButton = document.getElementById("toggleButton");
  toggleButton.addEventListener("click", toggleExtensionState);
});

// website input portion
function getWebsiteInput() {
  var websiteInput = document.getElementById("websiteInput").value;
  // If user clicks the -Block- button without entering input -> Alert Error
  if (!websiteInput) {
    //SY EDITS: function to edit the message pop up instead of an alert
    showError("Oops! Please enter a website URL");
  } else {
    // SYEDITS: extract the main domain from the input url
    // add http:// prefix if the input URL doesn't contain a protocol
    if (!websiteInput.match(/^[a-zA-Z]+:\/\//)) {
      websiteInput = "http://" + websiteInput;
    }

    var mainDomain;
    try {
      mainDomain = new URL(websiteInput).hostname.replace(/^www\./, ''); // Remove www part
      showError("saving: " + mainDomain);
    } catch (error) {
      //SY EDITS: function to edit the message pop up instead of an alert
      showError("Oops! Please enter a correct URL format");
      return;
    }
    
    // Retrieve the blockedWebsitesArray from Chrome browser, or initialize a new one
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      var blockedWebsitesArray = data.blockedWebsitesArray || [];
      // If: there is data in the array
      // Then: Alert Error
      // Else: Add the new input to the array
      const isInputInArray = blockedWebsitesArray.some(
        (item) => item === mainDomain
      );
      if (isInputInArray === true) {
        showError("Error: URL is already blocked");
      } else {
        blockedWebsitesArray.push(mainDomain);
        chrome.storage.sync.set(
          { blockedWebsitesArray: blockedWebsitesArray },
          function () {
            // Update the UI after the storage operation is complete
            updateBlockedWebsitesSection();
            document.getElementById("mainDomain").value = "";
            document.getElementById("mainDomain").focus();
          }
        );
      }
    });
  }
}

// Update the Popup's 'Blocked Websites' Section to current state
function updateBlockedWebsitesSection() {
  // Retrieve the blockedWebsitesDiv
  const blockedWebsitesDiv = document.getElementById("blockedWebsitesDiv");
  // Clear the blockedWebsitesDiv by removing all its child elements
  while (blockedWebsitesDiv.firstChild) {
    blockedWebsitesDiv.removeChild(blockedWebsitesDiv.firstChild);
  }
  // Get the stored array of blocked websites
  chrome.storage.sync.get("blockedWebsitesArray", function (data) {
    const blockedWebsitesArray = data.blockedWebsitesArray;
    // Check if the array is empty
    if (blockedWebsitesArray && blockedWebsitesArray.length > 0) {
      // If the array is not empty, remove the message that says 'No websites have been blocked' (if it exists)
      const nothingBlockedDiv = document.querySelector(".nothingBlocked");
      if (nothingBlockedDiv != null) {
        blockedWebsitesDiv.removeChild(nothingBlockedDiv);
      }
      // then iterate through each item in the stored array of Blocked Websites
      blockedWebsitesArray.forEach((website, index) => {
        // Create a new div for each URL
        const websiteDiv = document.createElement("div");
        // Add class (for styling) to websiteDiv block
        websiteDiv.classList.add("websiteDiv");
        // Create div for 'website text'
        const websiteDivText = document.createElement("div");
        websiteDivText.classList.add("websiteDivText");
        websiteDivText.textContent = website;
        // Append the websiteDivText to websiteDiv
        websiteDiv.appendChild(websiteDivText);
        // Create the unblock button
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete"); // Add your CSS class for styling the red button
        // Create an id value for the array item
        deleteButton.setAttribute("id", index);
        // Create the trash icon (using Font Awesome)
        const trashIcon = document.createElement("i");
        trashIcon.classList.add("fas", "fa-trash");
        trashIcon.setAttribute("id", index);
        // Append the trash icon to the delete button
        deleteButton.appendChild(trashIcon);
        // Add onClick function to each delete button
        deleteButton.addEventListener("click", unblockURL);
        // Append the red button to the websiteDiv
        websiteDiv.appendChild(deleteButton);
        // Append the websiteDiv to the blockedWebsitesDiv
        blockedWebsitesDiv.appendChild(websiteDiv);
      });
    } else {
      // If the array is empty, create the message element
      const nothingBlocked = document.createElement("div");
      nothingBlocked.textContent = "No websites have been blocked";
      nothingBlocked.classList.add("nothingBlocked");
      blockedWebsitesDiv.appendChild(nothingBlocked);
    }
  });
}

function unblockURL(event) {
  const clickedButtonId = event.target.id;
  // Get the blockedWebsitesArray
  chrome.storage.sync.get("blockedWebsitesArray", function (data) {
    let blockedWebsitesArray = data.blockedWebsitesArray;
    for (let i = 0; i < blockedWebsitesArray.length; i++) {
      if (clickedButtonId == i) {
        blockedWebsitesArray.splice(i, 1);
        break; // Exit the loop after removing the element
      }
    }
    // Save the updated array back to Chrome storage
    chrome.storage.sync.set({ blockedWebsitesArray: blockedWebsitesArray });
    updateBlockedWebsitesSection();
  });
}
