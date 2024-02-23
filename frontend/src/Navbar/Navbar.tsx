import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Divider, Typography, Grid, DialogActions, Button, DialogTitle, Dialog, IconButton } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../images/ThriveLogo.png';
import { useNavigate } from 'react-router-dom';
import mascot from '../images/mascot.png';
// Icon for MidTopSection
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';

// https://www.npmjs.com/package/react-pro-sidebar
export const Navbar = () => {
  const navigate = useNavigate();
  const [openDialog, setOpenDialog] = useState(false);
  const [dialogMessage, setDialogMessage] = useState('');

  const showDialog = (message: any) => {
    setDialogMessage(message);
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
  return (
    <Sidebar style={{ width: "100%", height: "100vh" }} >
      <Dialog
        open={openDialog}
        onClose={handleClose}
        aria-labelledby="alert-dialog-title"

      >
        <DialogTitle id="alert-dialog-title">{dialogMessage}</DialogTitle>
        <DialogActions>
          <Button onClick={handleClose}>OK</Button>
        </DialogActions>
      </Dialog>

      <Box id="leftSidebar" sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ height: '60px', display: 'flex', alignItems: 'center', }}>
          <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
          <h2 style={{ marginRight: 8 }}>Thrive</h2>
        </Box>
        <Divider />

        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ mt: 1, mb: 1, ml: 2 }}>
          <Typography> User Name section</Typography>
        </Box>
        <Divider />
        <Menu>
          <MenuItem onClick={() => navigate('/Dashboard')} icon={<GridViewOutlinedIcon />}>Dashboard</MenuItem>
          <MenuItem onClick={() => showDialog('Where get time for this')} icon={<ListAltOutlinedIcon />}>Tasks</MenuItem>
          <MenuItem onClick={() => navigate('/Wall')} icon={<SpaceDashboardOutlinedIcon />}>Your Wall</MenuItem>
          <MenuItem onClick={() => navigate('/Leaderboard')} icon={<LeaderboardOutlinedIcon />}>Leaderboard</MenuItem>
          <MenuItem onClick={() => showDialog('Where get time for this')} icon={<SettingsOutlinedIcon />}>Settings</MenuItem>
        </Menu>
        <Divider />
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ mt: 1, mb: 1, ml: 2 }}>
          <Typography> Friend section</Typography>
        </Box>
      </Box>
    </Sidebar>
  );
}
export const MidTopSection = () => {

  return (
    <Box sx={{ height: '60px', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', paddingRight: '16px' }}>
      <IconButton aria-label="icon1" size="large">
        <CalendarMonthOutlinedIcon />
      </IconButton>
      <IconButton aria-label="icon2" size="large">
        <LiveHelpOutlinedIcon />
      </IconButton>
      <IconButton aria-label="icon3" size="large">
        <NotificationsOutlinedIcon />
      </IconButton>
    </Box>
  );
}
export const RightNavbar = () => {
  return (
    <Box id="rightSidebar" sx={{ display: 'flex', flexDirection: 'column', height: '100%' }}>
      {/* Right top empty Space */}
      <Box sx={{ height: '60px' }} />
      <Divider />
      {/* Other section */}
      <Box id="other section" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 1, mb: 1, ml: 2, height: '10%', display: 'flex' }}>
          <Typography> Friends</Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 1, mb: 1, ml: 2, height: '25%', display: 'flex' }}>
          <Typography> Activities</Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 1, mb: 1, ml: 2, height: '35%', display: 'flex' }}>
          <Typography> Motivation Wall</Typography>
        </Box>
        <Divider />
        <Box sx={{ mt: 1, mb: 1, ml: 2, height: '30%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={mascot} alt="Description of Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Box>
    </Box>
  );
}
