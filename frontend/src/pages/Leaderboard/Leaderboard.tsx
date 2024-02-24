import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Box, Divider, Grid, Typography } from '@mui/material';

export const Leaderboard = () => {

    useEffect(() => {
    }, []);

    return (
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box id="navbar">                    <Navbar />
                </Box>
                <Box sx={{ width: '80%' }}>
                    <Box>
                        <MidTopSection />
                        <Divider />
                    </Box>
                    <Grid container spacing={3} sx={{ padding: 5, pt: 4 }} >
                        <Grid item xs={12} >
                            <Typography variant='h5' sx={{ ml: 1 }}>Leaderboard Page</Typography>

                        </Grid>                                {/* Leaderboard content here */}
                    </Grid></Box>
                <Box id="rightNavbar" sx={{ boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                    <RightNavbar />
                </Box>
            </Box>
        </div>
    )
}