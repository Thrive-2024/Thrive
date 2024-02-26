import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Tabs, Tab, Paper, Box, Divider, Grid, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, ListItemText } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";


const theme = createTheme({
    palette: {
        primary: {
            main: "#99C2F0"
        },
        secondary: {
            main: "#0D062D",
        }
    }
});

export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [user, setUser] = useState('')

    const leaderboardFetcher = async () => {
        console.log("leaderboard fetcher called");
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/miscellaneous/getMonthlyLeaderboard?year=2024&month=2`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            if (response.status != 200) {
                console.log("ERROR FETCHING LEADERBOARD");

            } else {
                const apiResponse = await response.json();
                console.log(apiResponse);
                setLeaderboard(apiResponse.data)
            }

        } catch (err) {
            window.alert(err);
            return null;
        }

    }


    useEffect(() => {
        leaderboardFetcher();
        setUser('tim@gmail.com');
    }, []);

    return (

        <ThemeProvider theme={theme}>

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
                            </Grid>
                            <Grid item xs={12} >
                                <Tabs
                                    aria-label="Tabs where each tab needs to be selected manually" sx={{ alignContent: 'center', ml: 1 ,borderRadius: 2 }}
                                >
                                    <Tab label="Friends" sx={{ textTransform: "none", backgroundColor: 'rgba(153, 194, 240, 0.25)', width: '25%' }} />
                                    <Tab disabled label="Regional" sx={{ textTransform: "none", backgroundColor: 'rgba(241, 241, 241, 0.25)', width: '25%' }} />
                                </Tabs>
                                <TableContainer component={Paper} sx={{ ml: 1 }}>
                                    <Table sx={{ minWidth: 650, }} aria-label="simple table">
                                        <TableHead sx={{}}>
                                            <TableRow sx={{ backgroundColor: 'primary.main'}}>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Rank</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>User</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Recent Activity</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Time Tracked</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody>
                                            {leaderboard.map((row, index) => (
                                                <TableRow
                                                    //   key={row.email}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 } , }}
                                                >
                                                    <TableCell sx={{height:'20px'}}>{index + 4}</TableCell>
                                                    <TableCell>{row.email}</TableCell>
                                                    <TableCell width={'40%'}><ListItemText
                                                        primary={'CS202 Assignment 2'}
                                                        secondary={'2 hours ago'}
                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                    /></TableCell>
                                                    <TableCell width={'15%'} align='center'>{row.totalDuration} Hrs</TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </TableContainer>
                            </Grid>
                        </Grid></Box>
                    <Box id="rightNavbar" sx={{ boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                        <RightNavbar />
                    </Box>
                </Box>
            </div></ThemeProvider>
    )

}