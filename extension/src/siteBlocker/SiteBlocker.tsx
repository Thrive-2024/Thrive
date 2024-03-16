import { useState, useEffect, Fragment } from "react";
import { Box, Divider, IconButton, Typography } from "@mui/material";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import CreateIcon from "@mui/icons-material/Create";
import SettingToggle from "./SettingsToggle";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import React from "react";
import { getStorage, } from "../pomodoro/utils/chrome";
import { Phase } from '../pomodoro/types';

const SiteBlocker = () => {
  // Define state variables
  const [isExtensionOn, setIsExtensionOn] = useState<boolean>(true);
  const [blockedWebsites, setBlockedWebsites] = useState<string[]>([]);
  const [websiteInputValue, setWebsiteInputValue] = useState<string>("");
  const [errorValue, setErrorValue] = useState<string>("");
  const [addWebsite, setAddWebsite] = useState<boolean>(false);
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  // UseEffect to initialize the extension state and blocked websites array
  const [currentPhase, setCurrentPhase] = useState<Phase | null>(null)
  useEffect(() => {
    // Retrieve the current state of the pomodoro status
    getStorage(['phase']).then(({ phase }) => {
      setCurrentPhase(phase)

      if(phase != "focus" ){
        // Retrieve the current state of the extension (whether it's on or off) from Chrome storage
        chrome.storage.sync.get("isExtensionOn", function (data) {
          setIsExtensionOn(
            data.isExtensionOn !== undefined ? data.isExtensionOn : true
          );
        });
      } else {
        setIsExtensionOn(true);
        chrome.storage.sync.set({ isExtensionOn: true });
      }
    })

    // Retrieve the array of blocked websites from Chrome storage
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      setBlockedWebsites(data.blockedWebsitesArray || []);
    });
  }, []); // Empty dependency array ensures this effect runs only once on component mount

  console.log(currentPhase)
  console.log(isExtensionOn)

  // Function to toggle the state of the extension
  const toggleExtensionState = () => {
    const newExtensionState = !isExtensionOn;
    setIsExtensionOn(newExtensionState);
    chrome.storage.sync.set({ isExtensionOn: newExtensionState });
  };

  // Function to handle changes in the input field
  const handleInputChange = (event: any) => {
    // Update the state with the new value of the input field
    setWebsiteInputValue(event.target.value);
  };

  // Function to handle the pressing of the edit button
  const handleEditButton = (event: any) => {
    setAddWebsite(true);
  };

  // Function to handle adding website to block list
  const getWebsiteInput = () => {
    var websiteInput = websiteInputValue;
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
        mainDomain = new URL(websiteInput).hostname.replace(/^www\./, ""); // Remove www part
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
          const updatedBlockedWebsitesArray = [
            ...(blockedWebsitesArray || []),
            mainDomain,
          ];
          setBlockedWebsites(updatedBlockedWebsitesArray);

          // Update Chrome storage with the new array
          chrome.storage.sync.set({
            blockedWebsitesArray: updatedBlockedWebsitesArray,
          });
        }
      });
    }
  };

  const handleClickOpen = (index: number) => {
    setOpenIndex(index);
  };

  const handleClose = () => {
    setOpenIndex(null);
  };

  // Function to handle removing website from block list
  const unblockURL = (index: number) => {
    handleClose();
    chrome.storage.sync.get("blockedWebsitesArray", function (data) {
      let blockedWebsitesArray = data.blockedWebsitesArray || [];
      // Remove the website from the array
      blockedWebsitesArray = blockedWebsitesArray.filter(
        (item: string, i: number) => i !== index
      );
      // Update the state with the new blocked websites array
      setBlockedWebsites(blockedWebsitesArray);
      // Update Chrome storage with the new array
      chrome.storage.sync.set({ blockedWebsitesArray });
    });
  };

  return (
    <div style={{ width: "90%", marginLeft: "10px", marginTop: "10px" }}>
      {/* first section: Settings  */}
      {currentPhase != "focus" && (
        <Box sx={{ display: "flex", justifyContent: "space-between" }}>
          <Typography
            sx={{
              color: "#A3A3A3",
              fontSize: "14px",
            }}
          >
            Restriction Status
          </Typography>
          <SettingToggle
            currentValue={isExtensionOn}
            handleToggle={toggleExtensionState}
          />
        </Box>
      )}
      {/* second section: Restricted Sites title */}
      <Typography
        sx={{
          fontSize: "18px",
          fontWeight: "500",
        }}
      >
        Restricted Sites
      </Typography>
      {/* fourth section: enter restricted sites*/}
      <Box sx={{ marginTop: "40px", display: "flex", flexDirection: "col" }}>
        {addWebsite ? ( // If addWebsite is true, display the form control
          <TextField
            id="outlined-basic"
            label="Enter site"
            variant="outlined"
            size="small"
            value={websiteInputValue}
            onChange={handleInputChange}
            inputProps={{
              onKeyDown: (event) => {
                // Prevent default action for Enter key to prevent form submission
                if (event.key === "Enter") {
                  event.preventDefault();
                  getWebsiteInput();
                  setWebsiteInputValue("");
                }
              },
            }}
            InputLabelProps={{
              sx: {
                fontSize: "13px",
              },
            }}
            InputProps={{
              classes: {
                root: "#95B6D4",
                focused: "#95B6D4",
              },
            }}
          />
        ) : (
          // If addWebsite is false, display the sites typography and create icon
          <>
            <Typography
              sx={{
                color: "#A3A3A3",
                fontSize: "14px",
                marginRight: "1px",
              }}
            >
              Sites
            </Typography>
            <IconButton
              size="small"
              onClick={handleEditButton}
              sx={{
                marginBottom: "8px",
              }}
            >
              <CreateIcon sx={{ fontSize: "14px", color: "#787486" }} />
            </IconButton>
          </>
        )}
      </Box>
      <Divider sx={{ marginTop: "3px" }} />
      {/* fifth section: restricted sites */}
      <Box sx={{ display: "flex", marginTop: "15px" }}>
        <Typography
          sx={{
            fontSize: "12px",
          }}
        >
          {blockedWebsites.map((website, index) => (
            <Fragment key={index}>
              <Chip
                label={website}
                onDelete={() => handleClickOpen(index)}
                variant="outlined"
                sx={{
                  marginRight: "2px",
                  marginBottom: "2px",
                  backgroundColor: "#9BC7EC",
                  color: "#FFFFFF",
                  borderColor: "#9BC7EC",
                  borderRadius: "20px",
                  "& .MuiChip-deleteIcon": {
                    color: "#F5F5F4",
                  },
                }}
              />
              <Dialog
                open={openIndex === index}
                onClose={handleClose}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
              >
                <DialogTitle id="alert-dialog-title">{`Unrestrict ${blockedWebsites[index]}?`}</DialogTitle>
                <DialogContent>
                  <DialogContentText id="alert-dialog-description">{`Are you sure?`}</DialogContentText>
                </DialogContent>
                <DialogActions>
                  <Button onClick={handleClose}>No</Button>
                  <Button onClick={() => unblockURL(index)} autoFocus>
                    Yes
                  </Button>
                </DialogActions>
              </Dialog>
            </Fragment>
          ))}
        </Typography>
      </Box>
    </div>
  );
};

export default SiteBlocker;
