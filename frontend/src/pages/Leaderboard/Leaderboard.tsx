import React, { useEffect, useState } from 'react';
import { Navbar,RightNavbar,TopSection } from '../../Navbar';
import { Box } from '@mui/material';

export const Leaderboard = () => {

    useEffect(() => {
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh',overflow: 'hidden'  }}>
            <Box sx={{ height: '10%' }}>
                <TopSection />
            </Box>
            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box id="navbar" sx={{ width: '20%' }}>
                    <Navbar />
                </Box>
                <Box sx={{ width: '60%', padding: '20px' }}>
                    <h1>Leaderboard page</h1>
                   
                </Box>
                <Box id="rightNavbar" sx={{ width: '20%', boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                    <RightNavbar />
                </Box>
            </Box>
        </div>
    )
}