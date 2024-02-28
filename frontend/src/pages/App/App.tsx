import React, { useEffect, useState } from "react";
import { Navbar, RightNavbar, MidTopSection } from "../../Navbar";
import { Box, Divider, Grid, Typography } from "@mui/material";
import { Dashboard } from "../Home";
import { Wall } from "../Wall";
import { Leaderboard } from "../Leaderboard";

export const App = () => {
  const [navValue, setNavValue] = useState('Dashboard');

  const handleNavValueChange = (value: string) => {
    setNavValue(value);
  };
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Box sx={{ display: "flex", width: "100%" }}>
        <Box id="navbar">
          <Navbar onNavValueChange={handleNavValueChange} />
        </Box>
        <Box sx={{ width: "80%" }}>
          <Box>
            <MidTopSection />
            <Divider />
          </Box>
          {/* Conditionally render components based on navValue */}
          {navValue === 'Dashboard' && <Dashboard />}
          {navValue === 'Wall' && <Wall />}
          {navValue === 'Leaderboard' && <Leaderboard />}
        </Box>
        <Box id="rightNavbar" sx={{ boxShadow: "0px 0px 1px rgba(0,0,0,0.5)" }}>
          <RightNavbar />
        </Box>
      </Box>
    </div>
  );
}