import React, { useEffect, useState } from "react";
import { Navbar, RightNavbar, MidTopSection } from "../../Navbar";
import { Box, Divider, Grid, Typography } from "@mui/material";

export const Wall = () => {
  useEffect(() => {}, []);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >

          <Grid container spacing={3} sx={{ padding: 5, pt: 4 }}>
            <Grid item xs={12}>
              <Typography variant="h5" sx={{ ml: 1 }}>
                Your Wall
              </Typography>
            </Grid>{" "}
            {/* Wall content here */}
          </Grid>
      
    </div>
  );
};
