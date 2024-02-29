import { useState, useEffect } from 'react';
import { Box, Divider, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';

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

  // Define the options array based on the extension state
  const options = isExtensionOn ? ['Off restrictions'] : ['On restrictions'];
  const ITEM_HEIGHT = 48;

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

    <div style={{ width: '90%', marginLeft: '10px', marginTop: '10px' }}>

      {/* first section: Settings  */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography
          sx={{
            color: "#A3A3A3",
            fontSize: '14px',
          }}
        >
          Settings
        </Typography>
        <Dropdown>
          <MenuButton
            variant="plain"
            size="sm"
          >
            <MoreVertIcon sx={{ fontSize: '20px' }} />
          </MenuButton>
          <Menu
            sx={{
              maxHeight: ITEM_HEIGHT * 4.5,
              overflowY: 'auto'
            }}
          >
            {options.map((option) => (
              <MenuItem key={option} onClick={toggleExtensionState} sx={{ fontSize: '14px' }}>
                {option}
              </MenuItem>
            ))}
          </Menu>
        </Dropdown>
      </Box>

      {/* second section: assignment name */}
      <Typography
        sx={{
          fontSize: '18px',
          fontWeight: '500'
        }}
      >
        Restricted Sites
      </Typography>

      {/* fourth section: sites title*/}
      <Box sx={{ display: 'flex', marginTop: '25px' }}>
        {/* <Typography
          sx={{
            color: '#A3A3A3',
            fontSize: '14px'
          }}
        >
          Sites
        </Typography> */}
        {/* <CreateIcon sx={{ fontSize: '14px', color: '#787486', marginLeft: '5px', marginTop: '4px' }} /> */}
        <TextField
          id="filled-basic"
          label="Site to Restrict"
          variant="filled"
          value={websiteInputValue}
          onChange={handleInputChange}
          size="small"
          InputProps={{
            onKeyDown: (event) => {
              // Prevent default action for Enter key to prevent form submission
              if (event.key === 'Enter') {
                event.preventDefault();
                getWebsiteInput();
              }
            }
          }}
        />
      </Box>
      
      <Divider sx={{ marginTop: '5px' }} />

      {/* fifth section: restricted sites */}
      <Box sx={{ display: 'flex', marginTop: '15px' }}>
        <Typography
          sx={{
            fontSize: '12px'
          }}
        >
          {blockedWebsites.map((website, index) => (
            <Chip
              key={index}
              label={website}
              onDelete={() => unblockURL(index)}
              variant="outlined"
              // deleteIcon={<DeleteIcon sx={{ color: '#F5F5F4' }} />}
              sx={{
                marginRight: '2px', 
                marginBottom: '2px', 
                backgroundColor: '#9BC7EC', // Set background color
                color: '#F5F5F4', // Set text color
                borderRadius: '20px',
                '& .MuiChip-deleteIcon': {
                  color: '#F5F5F4', // Change color here
                },
              }}
            />
          ))}
        </Typography>
      </Box>

    </div>
  );
}

export default SiteBlocker;