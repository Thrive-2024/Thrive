import React, { useState } from 'react';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Divider, Typography, Avatar, DialogActions, Button, DialogTitle, Dialog, IconButton } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../images/ThriveLogo.png';
import { useNavigate } from 'react-router-dom';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
// Icon for MidTopSection
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
// Images
import mascot from '../images/mascot.png';
import James from '../images/James.jpg';
import Tim from '../images/Tim.jpg';
import Carrie from '../images/Carrie.jpg';

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

        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ mt: 3, mb: 2, ml: 2 }}>
          <Avatar src={James} sx={{width: 50, height: 50, mr: 2 }} />
          <Typography>Welcome, James</Typography>
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
        <Box>
          {/* Title Row */}
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }} sx={{ m: 2 }}>
            <Typography>CLOSE FRIENDS</Typography>
            <IconButton size="small">
              <AddBoxOutlinedIcon />
            </IconButton>
          </Box>

          {/* Friend Row 1 */}
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }} sx={{ m: 2 }}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={Tim} sx={{ width: 50, height: 50, marginRight: 1 }} />
              <Typography>Tim Kowalski</Typography>
            </Box>
            <IconButton size="small">
              <MoreVertOutlinedIcon />
            </IconButton>
          </Box>

          {/* Friend Row 2 */}
          <Box style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginTop: 8 }} sx={{ m: 2 }}>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Avatar src={Carrie} sx={{ width: 50, height: 50, marginRight: 1 }} />
              <Typography>Carrie Walsh</Typography>
            </Box>
            <IconButton size="small">
              <MoreVertOutlinedIcon />
            </IconButton>
          </Box>
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
