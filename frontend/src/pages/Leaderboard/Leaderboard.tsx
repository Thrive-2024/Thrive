import React, { useEffect, useState } from 'react';
import { Tabs, Tab, Paper, Grid, Typography, Table, TableContainer, TableCell, TableHead, TableRow, TableBody, ListItemText, Avatar, Chip, FormControl, InputLabel, Select, MenuItem, Box } from '@mui/material';
import { ThemeProvider, createTheme } from "@mui/material/styles";

//import photos
import DefaultPhoto from '../../images/default.jpg';
import James from '../../images/James.jpg';
import Tim from '../../images/Tim.jpg';

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

//for task bottom right corner
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


export const Leaderboard = (props: any) => {
    const [leaderboard, setLeaderboard] = useState<any[]>([]);
    const [hasUser, setHasUser] = useState<boolean>(false);

    const [metric, setMetric] = useState('totalHour');

    const handleMetricChange = (event: any) => {
        setMetric(event.target.value);
    };

    const fetchLeaderboard = async () => {
        console.log("leaderboard fetcher called");
        // Get current year and month
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        // Note: January is 0, February is 1, and so on...
        const month = currentDate.getMonth() + 1 // Adding 1 to get the correct month
        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_PRODUCTION_URL}/miscellaneous/getMonthlyLeaderboard?year=${year}&month=${month}`, {
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
        fetchLeaderboard();
    }, [props.currentUser]);

    useEffect(() => {
        // Check if the current user is in the leaderboard
        const currentUserIndex = leaderboard.findIndex((row) => row.email === props.currentUser);
        setHasUser(currentUserIndex !== -1);
    }, [leaderboard, props.currentUser]);

    return (

        <ThemeProvider theme={theme}>

            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>


                <Grid container spacing={3} sx={{ padding: 5, pt: 4 }} >
                    <Grid item xs={12} >
                        <Typography variant='h5' sx={{ ml: 1 }}>Leaderboard Page</Typography>
                    </Grid>

                    {/* drawing of the standings */}
                    <Grid item xs={12} > <div>
                        <table id="ladder" align='center'>
                            <tr>
                                {/* second place */}
                                <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                    {leaderboard.length > 1 ? (
                                        <>
                                            {leaderboard[1].email === 'james@gmail.com' ? (
                                                <Avatar src={James} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                            ) : leaderboard[1].email === 'tim@gmail.com' ? (
                                                <Avatar src={Tim} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                            ) : (
                                                <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                            )}
                                        </>
                                    ) : (
                                        <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                    )}

                                    <div style={{ width: '150px', height: '140px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                        {leaderboard.length > 1 ? (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                {leaderboard[1].name}
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                None
                                            </Typography>
                                        )}
                                        {leaderboard.length > 1 ? (
                                            <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}><b>{convertToHours(leaderboard[1].totalDuration)}</b></Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}>
                                                0 hrs
                                            </Typography>
                                        )}
                                    </div>
                                </td>
                                {/* first place */}
                                <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                    <EmojiEventsSharpIcon sx={{ color: '#FFAA00' }} />
                                    {leaderboard.length > 0 ? (
                                        <>
                                            {leaderboard[0].email === 'james@gmail.com' ? (
                                                <Avatar src={James} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #FFAA00 solid' }} />)
                                                : leaderboard[0].email === 'tim@gmail.com' ? (
                                                    <Avatar src={Tim} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #FFAA00 solid' }} />) : (
                                                    <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #FFAA00 solid' }} />)}      </>
                                    ) : (
                                        <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #FFAA00 solid' }} />
                                    )}
                                    <div style={{ width: '150px', height: '160px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                        {leaderboard.length > 0 ? (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                {leaderboard[0].name}
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                None
                                            </Typography>
                                        )}
                                        {leaderboard.length > 0 ? (
                                            <Typography sx={{ paddingTop: '5px', color: '#FFAA00' }}><b>{convertToHours(leaderboard[0].totalDuration)}</b></Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '5px', color: '#FFAA00' }}>
                                                0 hrs
                                            </Typography>
                                        )}
                                    </div>
                                </td>
                                {/* third place */}
                                <td style={{ verticalAlign: 'bottom', textAlign: 'center' }}>
                                    {leaderboard.length > 2 ? (
                                        <>
                                            {leaderboard[2].email === 'james@gmail.com' ? (
                                                <Avatar src={James} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />)
                                                : leaderboard[2].email === 'tim@gmail.com' ? (
                                                    <Avatar src={Tim} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />) : (
                                                    <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />)}
                                        </>
                                    ) : (
                                        <Avatar src={DefaultPhoto} sx={{ width: '80px', height: '80px', margin: 'auto', border: '5px #93BFF0 solid' }} />
                                    )}                                   <div style={{ width: '150px', height: '120px', background: '#F1F1F1', marginTop: -30, borderRadius: '10px 10px 0 0' }}>
                                        {leaderboard.length > 2 ? (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                {leaderboard[2].name}
                                            </Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '40px' }}>
                                                None
                                            </Typography>
                                        )}
                                        {leaderboard.length > 2 ? (
                                            <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}><b>{convertToHours(leaderboard[2].totalDuration)}</b></Typography>
                                        ) : (
                                            <Typography sx={{ paddingTop: '5px', color: '#93BFF0' }}>
                                                0 hrs
                                            </Typography>
                                        )}
                                        {/* <Chip sx={{marginTop:'10px'}} label={'4 hrs'}/> */}

                                    </div>
                                </td>

                            </tr>
                        </table>
                    </div></Grid>

                    <Grid item xs={12}>
                        <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            <FormControl sx={{ minWidth: 120 }}>
                                <InputLabel id="demo-simple-select-label">Metric</InputLabel>
                                <Select
                                    labelId="demo-simple-select-label"
                                    id="demo-simple-select"
                                    value={metric}
                                    label="Metric"
                                    onChange={handleMetricChange}
                                    sx={{
                                        height: '40px', // Adjust the height of the Select component
                                        '& .MuiSelect-select': { height: '40px' }, // Adjust the inner select height
                                        '& .MuiOutlinedInput-notchedOutline': { // Optionally adjust the border height if needed
                                            top: 0,
                                        },
                                    }}
                                >
                                    <MenuItem value={'totalHour'}>Total Hour</MenuItem>
                                    <MenuItem value={'numOfTasks'}>Number of Task Completed</MenuItem>
                                    <MenuItem value={'numOfSession'}>Number of Session</MenuItem>
                                </Select>
                            </FormControl>
                        </Box>
                        <Tabs
                            aria-label="Tabs where each tab needs to be selected manually"
                            sx={{ display: 'flex', justifyContent: 'center', ml: 1, borderRadius: 2 }}
                            centered
                        >
                            <Tab value={0} label="Friends" sx={{ textTransform: "none", backgroundColor: 'rgba(153, 194, 240, 0.25)', fontWeight: 'bold', fontSize: '1rem', width: '25%', borderTopLeftRadius: 10 }} />
                            <Tab value={1} disabled label="Regional" sx={{ textTransform: "none", backgroundColor: 'rgba(241, 241, 241, 0.25)', fontWeight: 'bold', fontSize: '1rem', width: '25%', borderTopRightRadius: 10 }} />
                        </Tabs>

                        <TableContainer component={Paper} sx={{ ml: 1, maxHeight: '50vh' }}>
                            <Table sx={{ minWidth: 650 }} aria-label="simple table">
                                <TableHead sx={{ position: 'sticky', zIndex: 2, top: '0px', }}>
                                    <TableRow sx={{ backgroundColor: 'primary.main' }}>
                                        <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}><b>Rank</b></TableCell>
                                        {/* <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}></TableCell> */}
                                        <TableCell sx={{ color: '#ffffff', textAlign: 'left' }}><b>User</b></TableCell>
                                        <TableCell sx={{ color: '#ffffff', textAlign: 'left' }}><b>Recent Activity</b></TableCell>
                                        <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}>Latest</TableCell>
                                        {metric === 'totalHour' && <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}><b>Total Hours</b></TableCell>}
                                        {metric === 'numOfTasks' && <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}><b>Total Tasks Completed</b></TableCell>}
                                        {metric === 'numOfSession' && <TableCell sx={{ color: '#ffffff', textAlign: 'center' }}><b>Total Sessions</b></TableCell>}
                                    </TableRow>
                                </TableHead>
                                <TableBody >
                                    {/* display only the top 3 and the one above and below fo the user */}
                                    {leaderboard.length > 0 ? leaderboard.map((row, index) => {
                                        const isCurrentUser = row.email === props.currentUser;
                                        let displayIndices = [];

                                        // if this is the top 3 then add to the displayIndices
                                        if (index < 3) {
                                            displayIndices.push(index);

                                            // other wise if it is not, then check if it is the current user
                                        } else if (isCurrentUser) {
                                            // check the one above
                                            if (index - 1 >= 3) {
                                                displayIndices.push(index - 1);
                                            }

                                            // add the current guy
                                            displayIndices.push(index)

                                            // check the one below
                                            if (index + 1 < leaderboard.length) {
                                                displayIndices.push(index + 1);
                                            }
                                        }

                                        return displayIndices.map((displayIndex) => {
                                            const displayRow = leaderboard[displayIndex];
                                            const isHighlighted = displayRow.email === props.currentUser;

                                            return (
                                                <TableRow
                                                    key={displayRow.email}
                                                    sx={{ '&:last-child td, &:last-child th': { border: 0 }, backgroundColor: isHighlighted ? '#E5F1FF' : 'inherit', }}
                                                >
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0, width: 10, textAlign: 'center' }}>{displayIndex + 1}.</TableCell>

                                                    {/* <TableCell sx={{ paddingTop: 0, paddingBottom: 0, width: 10,textAlign: 'center' }}>
                                                        {displayRow.email === 'james@gmail.com' ? (
                                                            <Avatar src={James} />
                                                        ) : displayRow.email === 'tim@gmail.com' ? (
                                                            <Avatar src={Tim} />
                                                        ) : (
                                                            <Avatar src={DefaultPhoto} />
                                                        )}
                                                    </TableCell>
                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0 ,textAlign: 'center'}}>{displayRow.name}</TableCell> */}

                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0, textAlign: 'left' }}>
                                                        <Box sx={{ display: 'flex', flexDirection: 'row', alignItems: 'left', justifyContent: 'left' }}>
                                                            {displayRow.email === 'james@gmail.com' ? (
                                                                <Avatar src={James} sx={{ marginRight: 1 }} />
                                                            ) : displayRow.email === 'tim@gmail.com' ? (
                                                                <Avatar src={Tim} sx={{ marginRight: 1 }} />
                                                            ) : (
                                                                <Avatar src={DefaultPhoto} sx={{ marginRight: 1 }} />
                                                            )}
                                                            <Typography variant="body2">{displayRow.name}</Typography>
                                                        </Box>
                                                    </TableCell>
                                                    <TableCell width={'30%'} sx={{ paddingTop: 0, paddingBottom: 0 }}>
                                                        <ListItemText
                                                            primary={`${displayRow.lastTask}`}
                                                            secondary={`${getTimeElapsed(displayRow.lastUpdated)}`}
                                                            primaryTypographyProps={{ variant: 'body2' }}
                                                            secondaryTypographyProps={{ variant: 'caption' }}
                                                        />
                                                    </TableCell>

                                                    <TableCell sx={{ paddingTop: 0, paddingBottom: 0, textAlign: 'center' }}>
                                                        {metric === 'totalHour' && <Chip label={`${convertToHours(displayRow.lastTimeTracked)}`} sx={{ backgroundColor: 'primary.main', color: '#FFFFFF', width: 70 }} ></Chip>}
                                                        {metric === 'numOfTasks' && <Chip label={`${Math.ceil(displayRow.lastTimeTracked / 75)}`} sx={{ backgroundColor: 'primary.main', color: '#FFFFFF', width: 70 }} ></Chip>}
                                                        {metric === 'numOfSession' && <Chip label={`${Math.ceil(displayRow.totalDuration / 75) * 2}`} sx={{ backgroundColor: 'primary.main', color: '#FFFFFF', width: 70 }} ></Chip>}
                                                    </TableCell>

                                                    {metric === 'totalHour' && <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} width={'15%'} align='center'>{convertToHours(displayRow.totalDuration)}</TableCell>}
                                                    {metric === 'numOfTasks' && <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} width={'15%'} align='center'>{Math.ceil(displayRow.totalDuration / 75)}</TableCell>}
                                                    {metric === 'numOfSession' && <TableCell sx={{ paddingTop: 0, paddingBottom: 0 }} width={'15%'} align='center'>{Math.ceil(displayRow.totalDuration / 75) * 3}</TableCell>}
                                                </TableRow>
                                            );
                                        });
                                    }) : (
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography sx={{ textAlign: 'center', height: 100, pt: 10 }}>No Results Found...</Typography>
                                            </TableCell>
                                        </TableRow>
                                    )}


                                    {!hasUser &&
                                        <TableRow>
                                            <TableCell colSpan={6}>
                                                <Typography sx={{ textAlign: 'center', }}>Clock your hours with Thrive's Pomodoro timer to join the leaderboard!</Typography>
                                            </TableCell>
                                        </TableRow>
                                    }

                                </TableBody>
                            </Table>
                        </TableContainer>

                    </Grid>
                </Grid>
            </div></ThemeProvider>
    )

}