import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Box,Divider, Typography } from '@mui/material';
import GridViewOutlinedIcon from '@mui/icons-material/GridViewOutlined';
import ListAltOutlinedIcon from '@mui/icons-material/ListAltOutlined';
import SpaceDashboardOutlinedIcon from '@mui/icons-material/SpaceDashboardOutlined';
import LeaderboardOutlinedIcon from '@mui/icons-material/LeaderboardOutlined';
import SettingsOutlinedIcon from '@mui/icons-material/SettingsOutlined';
import logo from '../images/ThriveLogo.png';
import { useNavigate } from 'react-router-dom';

// https://www.npmjs.com/package/react-pro-sidebar
export const Navbar = () => {
  const navigate = useNavigate();
  return (
    <Box id="navbar" sx={{ width: '20%', height: '100%' }}>
      <Sidebar style={{ height: "100vh" }}>
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{mt: 1, mb:1, ml : 2}}>
          <img src={logo} alt="Logo" style={{ width: 50, height: 50 }} />
          <h2 style={{ margin: 0, marginRight: 8 }}>Thrive</h2>
        </Box>
        <Divider/>
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{mt: 1, mb:1, ml : 2}}>
          <Typography> User Name section</Typography>
        </Box>
        <Divider/>
        <Menu>
          <MenuItem  onClick={() => navigate('/Dashboard')}  icon={<GridViewOutlinedIcon />}>Dashboard</MenuItem>
          <MenuItem icon={<ListAltOutlinedIcon />}>Tasks</MenuItem>
          <MenuItem onClick={() => navigate('/Wall')} icon={<SpaceDashboardOutlinedIcon />}>Your Wall</MenuItem>
          <MenuItem onClick={() => navigate('/Leaderboard')} icon={<LeaderboardOutlinedIcon />}>Leaderboard</MenuItem>
          <MenuItem icon={<SettingsOutlinedIcon />}>Settings</MenuItem>
        </Menu>
        <Divider/>
        <Box style={{ display: 'flex', alignItems: 'center' }} sx={{mt: 1, mb:1, ml : 2}}>
          <Typography> Friend section</Typography>
        </Box>
      </Sidebar>

    </Box>
  );
}
