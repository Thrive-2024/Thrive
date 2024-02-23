import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar } from '../../Navbar';
import { Box, Divider } from '@mui/material';

export const Leaderboard = () => {

    useEffect(() => {
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box id="navbar" sx={{ width: '20%' }}>
                    <Navbar />
                </Box>
                <Box sx={{ width: '60%' }}>
                    <Box sx={{ height: '60px' }}>
                        {/* Top Space */}
                    </Box>
                    <Divider />
                    <h1>Leaderboard page</h1>

                </Box>
                <Box id="rightNavbar" sx={{ width: '20%', boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                    <RightNavbar />
                </Box>
            </Box>
        </div>
    )
}