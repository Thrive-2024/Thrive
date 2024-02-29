import { useState, useEffect, useContext } from 'react';
import { twMerge } from 'tailwind-merge'

const SiteBlocker = () => {
  // Define state variables
  const [isExtensionOn, setIsExtensionOn] = useState<boolean>(true);
  const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
  const [websiteInputValue, setWebsiteInputValue] = useState<string>('');
  const [errorValue, setErrorValue] = useState<string>('');

  // UseEffect to initialize the extension state and blocked websites array
  useEffect(() => {
    // Retrieve the current state of the extension (whether it's on or off) from Chrome storage
    chrome.storage.sync.get("isExtensionOn", function (data) {
      setIsExtensionOn(data.isExtensionOn !== undefined ? data.isExtensionOn : false);
    });

    // Retrieve the array of blocked websites from Chrome storage
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      setBlockedWebsites(data.blockedWebsitesArray || []);
    });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  // Function to toggle the state of the extension
  const toggleExtensionState = () => {
    const newExtensionState = !isExtensionOn;
    setIsExtensionOn(newExtensionState);
    chrome.storage.sync.set({ "isExtensionOn": newExtensionState });
  };

  // Function to handle changes in the input field
  const handleInputChange = (event: any) => {
    // Update the state with the new value of the input field
    setWebsiteInputValue(event.target.value);
  };



  // Function to handle adding website to block list
  const getWebsiteInput = () => {
    var websiteInput = websiteInputValue
    // If user clicks the -Block- button without entering input -> Alert Error
    if (!websiteInput) {
      //SY EDITS: function to edit the message pop up instead of an alert
      setErrorValue("Oops! Please enter a website URL");
    } else {
      // SYEDITS: extract the main domain from the input url
      // add http:// prefix if the input URL doesn't contain a protocol
      if (!websiteInput.match(/^[a-zA-Z]+:\/\//)) {
        websiteInput = "http://" + websiteInput;
      }

      var mainDomain: string;
      try {
        mainDomain = new URL(websiteInput).hostname.replace(/^www\./, ''); // Remove www part
        setErrorValue("saving: " + mainDomain);
      } catch (error) {
        //SY EDITS: function to edit the message pop up instead of an alert
        setErrorValue("Oops! Please enter a correct URL format");
        return;
      }
      chrome.storage.sync.get("blockedWebsitesArray", function (data) {
        const blockedWebsitesArray = data.blockedWebsitesArray || [];
        // Check if the website is already in the array
        const isInputInArray = blockedWebsitesArray.some(
          (item: string) => item === mainDomain
        );
        if (isInputInArray === true) {
          setErrorValue("Error: URL is already blocked");
        } else {
          // Update the state with the new blocked websites array
          const updatedBlockedWebsitesArray = [...(blockedWebsitesArray || []), mainDomain];
          setBlockedWebsites(updatedBlockedWebsitesArray);

          // Update Chrome storage with the new array
          chrome.storage.sync.set({ blockedWebsitesArray: updatedBlockedWebsitesArray });
        }
      });
    }
  };

  // Function to handle removing website from block list
  const unblockURL = (index: number) => {
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      let blockedWebsitesArray = data.blockedWebsitesArray || [];
      // Remove the website from the array
      blockedWebsitesArray = blockedWebsitesArray.filter((item: string, i: number) => i !== index);
      // Update the state with the new blocked websites array
      setBlockedWebsites(blockedWebsitesArray);
      // Update Chrome storage with the new array
      chrome.storage.sync.set({ blockedWebsitesArray });
    });
  };

  return (
    <div id="content-container">
      <section className="on-off-block">
        <button id="toggleButton" onClick={toggleExtensionState}>
          {isExtensionOn ? 'Turn Off' : 'Turn On'}
        </button>
      </section>
      <section className="add-block">
        <h2>Add to Block List</h2>
        <div className="main">
          <input type="text" id="websiteInput" value={websiteInputValue} onChange={handleInputChange} />
          <button className="block" id="blockButton" onClick={getWebsiteInput}>Block</button>
        </div>
        {errorValue && <div>{errorValue}</div>}
      </section>
      <section className="remove-block">
        <h2>Blocked Websites</h2>
        <div className="main" id="blockedWebsitesDiv">
          {blockedWebsites.map((website, index) => (
            <div key={index} className="flex">
              {website}
              <button className="justify-self-end m-[2px]" id={index.toString()} onClick={() => unblockURL(index)}>
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="22" id="trash"><g fill="none" fill-rule="evenodd" stroke="#000" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"><path d="M1 5h18M17 5v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5m3 0V3a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2M8 10v6M12 10v6"></path></g></svg>
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}

export default SiteBlocker;