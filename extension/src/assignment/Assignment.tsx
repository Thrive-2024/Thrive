import { Box, Container, Divider, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateIcon from '@mui/icons-material/Create';
import React from "react";
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';

const options = [
    'None',
    'Atria',
    'Callisto',
    'Dione',
    'Ganymede',
    'Hangouts Call',
    'Luna',
    'Oberon',
    'Phobos',
    'Pyxis',
    'Sedna',
    'Titania',
    'Triton',
    'Umbriel',
];

const ITEM_HEIGHT = 48;

const Assignment = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    return (
        <div style={{ width:'90%', marginLeft:'10px', marginTop:'10px' }}>

                {/* first section: currently working on  */}
                <Box sx={{ display:'flex', justifyContent:'space-between' }}>
                    <Typography 
                        sx={{ 
                            color:"#A3A3A3", 
                            fontSize:'14px',
                        }} 
                    >
                        Currently working on
                    </Typography>
                    <Dropdown>
                        <MenuButton
                            variant="plain"
                            size="sm"
                        >
                            <MoreVertIcon sx={{ fontSize:'20px' }} />
                        </MenuButton>
                        <Menu
                            sx={{
                                maxHeight: ITEM_HEIGHT * 4.5,
                                overflowY:'auto'
                            }}
                        >
                            {options.map((option) => (
                            <MenuItem key={option} selected={option === 'Pyxis'} onClick={handleClose} sx ={{ fontSize:'14px' }}>
                                {option}
                            </MenuItem>
                            ))}
                        </Menu>
                    </Dropdown>
                </Box>

                {/* second section: assignment name */}
                <Typography
                    sx={{
                        fontSize:'18px',
                        fontWeight:'500'
                    }}
                >
                    Assignment 2
                </Typography>

                {/* third section: assignment tag and days left */}
                <Box sx={{ display:'flex', justifyContent:'space-between', marginTop:'8px' }} >
                    <Typography
                        sx={{
                            fontSize:'12px',
                            backgroundColor:'#CCCCFF',
                            borderRadius:'11px',
                            paddingTop:'1px', 
                            paddingBottom:'1px',
                            paddingLeft:'7px',
                            paddingRight:'7px'
                        }}
                    >
                        Linear Algebra
                    </Typography>
                    <Typography 
                        sx={{
                            color: '#787486',
                            fontSize:'14px'
                        }}
                    >
                        2 days left
                    </Typography>
                </Box>

                {/* fourth section: notes title*/}
                <Box sx={{ display:'flex', marginTop:'25px' }}>
                    <Typography
                        sx={{
                            color:'#A3A3A3',
                            fontSize:'14px'
                        }}
                    >
                        Notes
                    </Typography>
                    <CreateIcon sx={{ fontSize:'14px', color:'#787486', marginLeft:'5px', marginTop:'4px' }} />
                </Box>
                <Divider sx={{ marginTop:'5px' }} />

                {/* fifth section: notes */}
                <Box sx={{ display:'flex', marginTop:'15px' }}>
                    <Typography
                        sx={{
                            fontSize:'12px'
                        }}
                    >
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.
                    </Typography>
                </Box>

        </div>
    );
}

export default Assignment;