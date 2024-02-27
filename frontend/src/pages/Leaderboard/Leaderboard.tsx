import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Tabs, Tab, Paper, Box, Divider, Grid, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, ListItemText, Avatar, Chip } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";

//import photos
import DefaultPhoto from '../../images/default.jpg';
import James from '../../images/James.jpg';

//import icons
import EmojiEventsSharpIcon from '@mui/icons-material/EmojiEventsSharp';

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

// const testdata = [
//     { email: 'john@example.com', name: 'John Doe', lastTask: 'Task A', totalDuration: 5, currentUser: 'john@example.com', lastTimeTracked: 120, lastUpdated: '2024-02-27T12:30:00' },
//     { email: 'jane@example.com', name: 'Jane Smith', lastTask: 'Task B', totalDuration: 3, currentUser: 'john@example.com', lastTimeTracked: 180, lastUpdated: '2024-02-27T13:45:00' },
//     { email: 'alice@example.com', name: 'Alice Johnson', lastTask: 'Task C', totalDuration: 7, currentUser: 'alice@example.com', lastTimeTracked: 300, lastUpdated: '2024-02-27T15:20:00' },
//     { email: 'bob@example.com', name: 'Bob Brown', lastTask: 'Task D', totalDuration: 6, currentUser: 'bob@example.com', lastTimeTracked: 240, lastUpdated: '2024-02-27T10:15:00' },
//     { email: 'eve@example.com', name: 'Eve Taylor', lastTask: 'Task E', totalDuration: 4, currentUser: 'alice@example.com', lastTimeTracked: 150, lastUpdated: '2024-02-27T09:00:00' },
//     { email: 'mike@example.com', name: 'Mike Wilson', lastTask: 'Task F', totalDuration: 8, currentUser: 'john@example.com', lastTimeTracked: 180, lastUpdated: '2024-02-27T16:45:00' },
//     { email: 'sarah@example.com', name: 'Sarah Lee', lastTask: 'Task G', totalDuration: 2, currentUser: 'sarah@example.com', lastTimeTracked: 90, lastUpdated: '2024-02-27T11:30:00' },
//     { email: 'david@example.com', name: 'David Clark', lastTask: 'Task H', totalDuration: 9, currentUser: 'david@example.com', lastTimeTracked: 210, lastUpdated: '2024-02-27T14:00:00' },
//     { email: 'emily@example.com', name: 'Emily Turner', lastTask: 'Task I', totalDuration: 3, currentUser: 'alice@example.com', lastTimeTracked: 120, lastUpdated: '2024-02-27T17:15:00' },
//     { email: 'sam@example.com', name: 'Samuel Evans', lastTask: 'Task J', totalDuration: 5, currentUser: 'sam@example.com', lastTimeTracked: 180, lastUpdated: '2024-02-27T18:30:00' }
// ];

const convertToHours = (timeInMinutes: any) => {
    const hours = (timeInMinutes / 60).toFixed(1); // Convert minutes to hours with 1 decimal place
    return `${parseFloat(hours) < 2 ? hours + " Hr" : hours + ' Hrs'}`;
};

//for 
const getTimeElapsed = (dateTime: string): string => {
    const postDateTime = new Date(dateTime);
    const currentTime = new Date();
    const timeDiffInMs = currentTime.getTime() - postDateTime.getTime();
    const secondsDiff = Math.floor(timeDiffInMs / 1000);

    if (secondsDiff < 60) {
        return `${secondsDiff} seconds ago`;
    }

    const minutesDiff = Math.floor(secondsDiff / 60);
    if (minutesDiff < 60) {
        return `${minutesDiff} minutes ago`;
    }

    const hoursDiff = Math.floor(minutesDiff / 60);
    if (hoursDiff < 24) {
        return `${hoursDiff} hours ago`;
    }

    const daysDiff = Math.floor(hoursDiff / 24);
    if (daysDiff === 1) {
        return `${daysDiff} day ago`;
    } else {
        return `${daysDiff} days ago`;
    }
}


export const Leaderboard = () => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [currentUser, setCurrentUser] = useState('')

    const leaderboardFetcher = async () => {
        console.log("leaderboard fetcher called");
        const timezone = Intl.DateTimeFormat().resolvedOptions().timeZone;
        console.log(timezone);
        // Get current year and month
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        // Note: January is 0, February is 1, and so on...
        const month = currentDate.getMonth() + 1 // Adding 1 to get the correct month
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/miscellaneous/getMonthlyLeaderboard?year=${year}&month=${month}`, {
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
        setCurrentUser('tim@gmail.com');
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
                            <Grid item xs={12} > <div>
                                <table id="ladder" align='center'>
                                    <tr>
                                        <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                            <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                            <div style={{ width: '150px', height: '140px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                                {leaderboard.length > 1 ? (
                                                    <Typography sx={{ paddingTop: '40px' }}>
                                                        {leaderboard[1].name}
                                                    </Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                                {leaderboard.length > 1 ? (
                                                    <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}><b>{convertToHours(leaderboard[1].totalDuration)}</b></Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                            </div>
                                        </td>

                                        <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                            <EmojiEventsSharpIcon sx={{ color: '#FFAA00' }} />
                                            <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #FFAA00 solid' }} />
                                            <div style={{ width: '150px', height: '160px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                                {leaderboard.length > 0 ? (
                                                    <Typography sx={{ paddingTop: '40px' }}>
                                                        {leaderboard[0].name}
                                                    </Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                                {leaderboard.length > 0 ? (
                                                    <Typography sx={{ paddingTop: '5px', color: '#FFAA00' }}><b>{convertToHours(leaderboard[0].totalDuration)}</b></Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                            </div>
                                        </td>

                                        <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                            <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                            <div style={{ width: '150px', height: '120px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                                {leaderboard.length > 2 ? (
                                                    <Typography sx={{ paddingTop: '40px' }}>
                                                        {leaderboard[2].name}
                                                    </Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                                {leaderboard.length > 2 ? (
                                                    <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}><b>{convertToHours(leaderboard[2].totalDuration)}</b></Typography>
                                                ) : (
                                                    <Typography>
                                                        Null
                                                    </Typography>
                                                )}
                                                {/* <Chip sx={{marginTop:'10px'}} label={'4 hrs'}/> */}

                                            </div>
                                        </td>

                                    </tr>
                                </table>
                            </div></Grid>
                            <Grid item xs={12} >
                                <Tabs
                                    aria-label="Tabs where each tab needs to be selected manually" sx={{ alignContent: 'center', ml: 1, borderRadius: 2 }}
                                >
                                    <Tab value={0} label="Friends" sx={{ textTransform: "none", backgroundColor: 'rgba(153, 194, 240, 0.25)', width: '25%' }} />
                                    <Tab value={1} disabled label="Regional" sx={{ textTransform: "none", backgroundColor: 'rgba(241, 241, 241, 0.25)', width: '25%' }} />
                                </Tabs>
                                <TableContainer component={Paper} sx={{ ml: 1, maxHeight: 320 }}>
                                    <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                        <TableHead sx={{ position: 'sticky', zIndex: 2, top: '0px', }}>
                                            <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Rank</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>User</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Recent Activity</b></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}></TableCell>
                                                <TableCell sx={{ color: '#ffffff' }}><b>Time Tracked</b></TableCell>
                                            </TableRow>
                                        </TableHead>
                                        <TableBody >
                                            {leaderboard.slice(3).map((row, index) => (
                                                <TableRow
                                                    key={row.email}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: row.email === currentUser ? '#E5F1FF' : 'inherit', }}
                                                >
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0, width: 10 }}>{index + 4}.</TableCell>
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0, width: 10 }}>

                                                        <Avatar src={DefaultPhoto} />

                                                    </TableCell>
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                        {row.name}
                                                    </TableCell>
                                                    <TableCell width={'30%'} sx={{ paddingTop: 0, paddingBottom: 0 }}><ListItemText
                                                        primary={`${row.lastTask}`}
                                                        secondary={`${getTimeElapsed(row.lastUpdated)}`}
                                                        primaryTypographyProps={{ variant: 'body2' }}
                                                        secondaryTypographyProps={{ variant: 'caption' }}
                                                    /></TableCell>
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                        <Chip label={`${convertToHours(row.lastTimeTracked)}`} sx={{ backgroundColor: 'primary.main', color: '#FFFFFF', width: 70 }} ></Chip>
                                                    </TableCell>
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} width={'15%'} align='center'>{convertToHours(row.totalDuration)}</TableCell>
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