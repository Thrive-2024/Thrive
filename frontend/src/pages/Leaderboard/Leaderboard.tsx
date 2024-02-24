import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Box, Divider } from '@mui/material';

export const Leaderboard = () => {

    useEffect(() => {
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box id="navbar" sx={{ width: 300}}>
                    <Navbar />
                </Box>
                <Box sx={{ width: '80%'}}>
                <Box>
                    <MidTopSection/>
                    <Divider />
                    <h1>Leaderboard page</h1>
                    {/* Leaderboard content here */}
                </Box></Box>
                <Box id="rightNavbar" sx={{ width: 300, boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                    <RightNavbar />
                </Box>
            </Box>
        </div>
    )
}