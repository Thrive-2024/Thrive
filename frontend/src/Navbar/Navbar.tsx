import React, { useEffect, useState } from 'react';
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Card, Divider, Typography, Avatar, DialogActions, Badge, Button, DialogTitle, Dialog, IconButton, styled, Stack, List, ListItem } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../images/ThriveLogo.png';
import { useNavigate } from 'react-router-dom';
import AddBoxOutlinedIcon from '@mui/icons-material/AddBoxOutlined';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import { useLocation } from 'react-router-dom';

//carousel for motivation wall right panel
import { Carousel } from 'react-responsive-carousel';
import 'react-responsive-carousel/lib/styles/carousel.min.css';



// Icon for MidTopSection
import NotificationsOutlinedIcon from '@mui/icons-material/NotificationsOutlined';
import LiveHelpOutlinedIcon from '@mui/icons-material/LiveHelpOutlined';
import CalendarMonthOutlinedIcon from '@mui/icons-material/CalendarMonthOutlined';
// Images
import mascot from '../images/mascot.png';
import James from '../images/James.jpg';
import Tim from '../images/Tim.jpg';
import Carrie from '../images/Carrie.jpg';
const OnlineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#44b700',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,

  }
}));
const OfflineBadge = styled(Badge)(({ theme }) => ({
  '& .MuiBadge-badge': {
    backgroundColor: '#D9D9D9',
    color: '#44b700',
    boxShadow: `0 0 0 2px ${theme.palette.background.paper}`,
  }
}));
const Activity = styled(Card)(({ theme }) => ({
  backgroundColor: '#F7F7F7',
  font: '#787486',
  padding: 10,
  textAlign: 'left',
  color: theme.palette.text.secondary,
  lineHeight: 1.5,
  height: 44,
  borderRadius: 10,
  boxShadow: '0 0 0 0',
  display: '-webkit-box',
  WebkitLineClamp: 2, // Limit to 2 lines
  WebkitBoxOrient: 'vertical',
  overflow: 'hidden',

}));

const currentUser = 'james@gmail.com';

// https://www.npmjs.com/package/react-pro-sidebar
export const Navbar = () => {
  const location = useLocation();
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

  // Function to determine if the path matches the current location
  const isActive = (path: any) => location.pathname === path;
  console.log(location.pathname)
  return (
    <Sidebar style={{ width: "300", height: "100vh" }} >
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
          <Avatar src={James} sx={{ width: 50, height: 50, mr: 2 }} />
          <Typography>Welcome, James</Typography>
        </Box>
        <Divider />
        <Menu>
          <MenuItem
            onClick={() => navigate('/Dashboard')}
            icon={<GridViewOutlinedIcon />}
            style={{ backgroundColor: isActive('/Dashboard') ? '#E3ECF6' : 'primary.main' }}
          >
            Dashboard
          </MenuItem>

          <MenuItem onClick={() => showDialog('Where got time for this')} icon={<ListAltOutlinedIcon />}>Tasks</MenuItem>
          <MenuItem
            onClick={() => navigate('/Wall')}
            icon={<SpaceDashboardOutlinedIcon />}
            style={{ backgroundColor: isActive('/Wall') ? '#E3ECF6' : 'primary.main' }}
          >
            Your Wall
          </MenuItem>
          <MenuItem
            onClick={() => navigate('/Leaderboard')}
            icon={<LeaderboardOutlinedIcon />}
            style={{ backgroundColor: isActive('/Leaderboard') ? '#E3ECF6' : 'primary.main' }}
          >
            Leaderboard
          </MenuItem>
          <MenuItem onClick={() => showDialog('Where got time for this')} icon={<SettingsOutlinedIcon />}>Settings</MenuItem>
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

  const [motivationArray, setMotivationArray] = useState<any[]>([])

  //GET method to fetch all tasks and update 
  const fetchMotivation = async () => {
    console.log("motivation fetcher called");
    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/motivation/getAllByReceiver?receiver=${currentUser}`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });

      if (response.status != 200) {
        console.log("ERROR FETCHING MOTIVATION");

      } else {
        const apiResponse = await response.json();
        // console.log(apiResponse);
        console.log("success fetching motivation")
        setMotivationArray(apiResponse.data)
      }

    } catch (err) {
      window.alert(err);
      return null;
    }

  }

  useEffect(() => {
    fetchMotivation();
  }, []);
  return (
    <Box id="rightSidebar" sx={{ display: 'flex', flexDirection: 'column', height: '100%', width: 300 }}>
      {/* Right top empty Space */}
      <Box sx={{ height: '60px' }} />
      <Divider />
      {/* Other section */}
      <Box id="other section" sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ mt: 2, mb: 1, ml: 2, display: 'flex' }}>
          <Typography> Friends</Typography>
        </Box>
        <Box sx={{ mt: 0, mb: 2, ml: 2, display: 'flex' }}>

          <Box sx={{ marginRight: 1 }}>
            <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar src={Carrie} sx={{ width: 50, height: 50 }} />
            </OnlineBadge></Box>
          <Box sx={{ marginRight: 1 }}>
            <OnlineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar src={Carrie} sx={{ width: 50, height: 50 }} />
            </OnlineBadge></Box>
          <Box sx={{ marginRight: 1 }}>
            <OfflineBadge
              overlap="circular"
              anchorOrigin={{ vertical: 'bottom', horizontal: 'right' }}
              variant="dot"
            >
              <Avatar src={Carrie} sx={{ width: 50, height: 50 }} />
            </OfflineBadge></Box>
        </Box>

        <Divider />
        <Box sx={{ mt: 2, mb: 1, ml: 2, display: 'flex' }}>
          <Typography> Activities</Typography>
        </Box>
        <Box sx={{ mb: 2, ml: 2, mr: 2, display: 'flex' }}>
          <Box style={{ maxHeight: 200, overflow: 'auto', width: '100%' }} sx={{}}>
            <Stack spacing={1}>
              <Activity>Tim completed Linear Algebra Assignment 2, clocking a record of 3hrs.</Activity>
              <Activity>Hayward achieved a new personal record of 25hrs this week.</Activity>
              <Activity>Exciting news! Jacob has surged ahead to claim the top spot on this week's leaderboard, surpassing Emily's previous position.  </Activity>
              <Activity>Lily nailed her painting project, spending an impressive 7 hours bringing her canvas to life.</Activity>
            </Stack>
            {/* <List>
              <ListItem sx={{height:2}}><Avatar src = {Carrie}/> Tim completed Linear Algebra Assignment 2, clocking a record of 3hrs.</ListItem>
            </List> */}
          </Box>
        </Box>



        <Divider />

        <Box sx={{ mt: 2, mb: 1, ml: 2, display: 'flex' }}>
          <Typography> Motivation Wall</Typography>
        </Box>
        <Box sx={{ mb: 2, ml: 2, mr: 2, display: 'flex', height: '10%' }}>
          {/* https://www.npmjs.com/package/react-responsive-carousel */}
          {motivationArray.length > 0 ? (
            <Carousel
                autoPlay={true}
                showArrows={false}
                showIndicators={false}
                showStatus={false}
                showThumbs={false}
                infiniteLoop={true}
                stopOnHover={true}
                interval={3000}
                axis='vertical'
            >
                {motivationArray.map((word, index) => (
                    <Typography key={index} sx={{
                        textAlign: 'left', display: '-webkit-box',
                        WebkitLineClamp: 3, // Limit to 3 lines
                        WebkitBoxOrient: 'vertical',
                        overflow: 'hidden', height: 100
                    }}>
                        <b>{word.sender}</b>: {word.message}
                    </Typography>
                ))}
            </Carousel>
        ) : (
            <div>Loading...</div> // Or any loading indicator
        )}
        </Box>
        <Divider />
        <Box sx={{ mt: 1, mb: 1, ml: 2, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <img src={mascot} alt="Description of Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />
        </Box>
      </Box>
    </Box>
  );
}
