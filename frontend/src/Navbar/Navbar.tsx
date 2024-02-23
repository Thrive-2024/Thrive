import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box, Divider, Typography, Grid } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../images/ThriveLogo.png';
import { useNavigate } from 'react-router-dom';
import mascot from '../images/mascot.png'; 

export const TopSection = () => {
  return (
    <Box id="top" sx={{ width: '100%' }}>
      <Grid container sx={{ alignItems: 'center' }} spacing={2}>
        {/* First part - 20% width */}
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center', backgroundColor: '#eceff' }}>
          <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
          <h2 style={{ margin: 0, marginRight: 8 }}>Thrive</h2>
        </Grid>
        {/* Second part - 60% width, assuming it's empty or for future content */}
        <Grid item xs={8} sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Content goes here */}
        </Grid>

        {/* Third part - 20% width, also assuming it's for future content */}
        <Grid item xs={2} sx={{ display: 'flex', alignItems: 'center' }}>
          {/* Content goes here */}
        </Grid>
      </Grid>

      {/* Divider below the grid */}
      <Divider />
    </Box>
  );
}
// https://www.npmjs.com/package/react-pro-sidebar
export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Sidebar style={{ width: "100%", height: "100vh" }}>
      {/* <Box style={{ display: 'flex', alignItems: 'center' }} sx={{mt: 1, mb:1, ml : 2, height: '6%'}}>
          <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
          <h2 style={{ margin: 0, marginRight: 8 }}>Thrive</h2>
        </Box>
        <Divider/> */}
      <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ mt: 1, mb: 1, ml: 2 }}>
        <Typography> User Name section</Typography>
      </Box>
      <Divider />
      <Menu>
        <MenuItem onClick={() => navigate('/Dashboard')} icon={<GridViewOutlinedIcon />}>Dashboard</MenuItem>
        <MenuItem icon={<ListAltOutlinedIcon />}>Tasks</MenuItem>
        <MenuItem onClick={() => navigate('/Wall')} icon={<SpaceDashboardOutlinedIcon />}>Your Wall</MenuItem>
        <MenuItem onClick={() => navigate('/Leaderboard')} icon={<LeaderboardOutlinedIcon />}>Leaderboard</MenuItem>
        <MenuItem icon={<SettingsOutlinedIcon />}>Settings</MenuItem>
      </Menu>
      <Divider />
      <Box style={{ display: 'flex', alignItems: 'center' }} sx={{ mt: 1, mb: 1, ml: 2 }}>
        <Typography> Friend section</Typography>
      </Box>
    </Sidebar>
  );
}

export const RightNavbar = () => {
  return (
    <Box id="rightSidebar" sx={{ height: '90%', display: 'flex', flexDirection: 'column' }}>
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
  );
}
