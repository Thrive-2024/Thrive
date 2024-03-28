import Chart from "../../components/Chart";
import Cogwheel from "../../components/Cogwheel";
import { useContext, useEffect, useState } from "react";
import CurrentPhase from "./CurrentPhase";
import { DisplayPageContext } from "../../popup/DisplayPageContextProvider";
import { Typography } from "@mui/material";
import { getStorage } from "../../utils/chrome";
import { StorageValue } from "../../types";
import Marquee from "react-fast-marquee";
import { REACT_APP_BACKEND_DEV_URL } from "../../../constants/envConsts";

const HeaderMenu = () => {
  const [currentMessage, setCurrentMessage] = useState<string>(
    "Slay. Serve. Survive - Prof Ben"
  );
  const [currentUser, setCurrentUser] = useState<string>(
    "james@gmail.com"
  );
  const { setDisplayPageType } = useContext(DisplayPageContext);

  // getStorage([
  //   "currentUser",
  // ]).
  // then((value: StorageValue) => {
  //   setCurrentUser(value.currentUser);
  // });

  const fetchMessageFromSystem = async () => {
    try {
      const response = await fetch(
        `${REACT_APP_BACKEND_DEV_URL}/motivation/getAllByReceiver?receiver=${currentUser}`,
        {
          headers: {
            "Content-Type": "application/json",
          },
          method: "GET",
        }
      );

      if (response.status != 200) {
        console.log("ERROR FETCHING MESSAGE");
      } else {
        const apiResponse = await response.json();
        console.log(apiResponse);
        let currentMessages= apiResponse.data;
        if (currentMessages.length > 0) {
          // Generate a random index within the range of the array length
          const randomIndex = Math.floor(Math.random() * currentMessages.length);
          
          // Retrieve the randomly selected message
          const randomMessage = currentMessages[randomIndex].message + " ";
          // setCurrentMessage(randomMessage);
          setCurrentMessage(currentMessages[0].message + " ");
        }
      }
    } catch (err) {
      console.log("ERROR FETCHING MESSAGE");
      return null;
    }
  };

  // Effect to check every 10 minutes
  useEffect(() => {
    const interval = setInterval(() => {
      // Perform your check here
      fetchMessageFromSystem()
      // For demonstration, let's just log a message
      console.log("Checking...");
    }, 10 * 1000); // 10 minutes in milliseconds

    // Clean up the interval on component unmount
    return () => clearInterval(interval);
  }, [currentMessage]); // Empty dependency array ensures the effect runs only once

  return (
    <div>
      <div className="ml-5 mt-0 flex justify-between">
        <div className="flex gap-1">
          <button
            onClick={() => {
              setDisplayPageType("history");
            }}
          >
            <Chart />
          </button>
          <button
            onClick={() => {
              setDisplayPageType("settings");
            }}
          >
            <Cogwheel />
          </button>
        </div>
        <CurrentPhase inPopup />
      </div>
      <div className="ml-5 flex items-center justify-center text-center">
        <Typography
          sx={{
            fontSize: "15px",
            color: "black",
            marginTop: "20px",
          }}
        >
          <Marquee speed={30}>
            {currentMessage}
          </Marquee>
        </Typography>
      </div>
    </div>
  );
};

export default HeaderMenu;
