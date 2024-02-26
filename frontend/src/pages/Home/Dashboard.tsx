import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Box, Divider, Grid, Typography, Card, Chip, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import ScheduleIcon from '@mui/icons-material/Schedule';
import { green, grey, red } from '@mui/material/colors';

import StatsPlaceholder from '../../images/stats.jpg';

//creating theme
const theme = createTheme({
    palette: {
        primary: {
            main: "#99C2F0"
        },
        secondary: {
            main: "#0D062D",
        },
    }
});
<style>
</style>

export const Dashboard = () => {

    useEffect(() => {
    }, []);

    // list of draggable tasks
    const tasks = [
        { id: "1", content: "First task", daysLeft: 3, subject: 'Linear Algebra' },
        { id: "2", content: "Second task", daysLeft: 4, subject: 'AWS Tutorial' },
        { id: "3", content: "Third task", daysLeft: 3, subject: 'Algorithms' },
        { id: "4", content: "Fourth task", daysLeft: 2, subject: 'Leetcode' },
        { id: "5", content: "Fifth task", daysLeft: 6, subject: 'Ethics' },
        { id: "6", content: "Sixth task", daysLeft: 2, subject: 'Algorithms' }

    ];

    const subjectColor = (task: String) => {
        switch (task) {
            case 'Linear Algebra':
                return '#CCFFCC';
            case 'AWS Tutorial':
                return '#FFC4C4';
            case 'Algorithms':
                return '#CCCCFF';
            case 'Ethics':
                return '#FFCC99';
            case 'Leetcode':
                return '#FFFFCC';
            default:
                return '#D7D7D7';
        }
    }

    //type of lists and array to store them
    const taskStatus = {
        toDo: {
            name: "Tasks",
            items: tasks
        },
        inProgress: {
            name: "In Progress",
            items: []
        },
        done: {
            name: "Done",
            items: []
        }
    };

    //task dragging function
    const onDragEnd = (result: any, columns: any, setColumns: any) => {
        if (!result.destination) return;
        const { source, destination } = result;

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = columns[source.droppableId];
            const destColumn = columns[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...sourceColumn,
                    items: sourceItems
                },
                [destination.droppableId]: {
                    ...destColumn,
                    items: destItems
                }
            });
        } else {
            const column = columns[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setColumns({
                ...columns,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    const [columns, setColumns] = useState(taskStatus);

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
                            {/* Dashboard content here */}
                        </Box>  <Grid container spacing={3} sx={{ padding: 5, pt: 4 }} >
                            <Grid item xs={12} >
                                <Typography variant='h5' sx={{ ml: 1 }}>This Week</Typography>
                            </Grid>
                            {/* <Grid item xs={4} >
                            <Card sx={{ border: '1px black', height: '30vh', padding: 3 }}>
                                <Typography sx={{ mb: 1, }}><b>Tasks</b><Chip size="small" label="4" sx={{ ml: 1 }} /></Typography>

                                <Divider />

                            </Card>
                        </Grid>
                        <Grid item xs={4} >
                            <Card sx={{ border: '1px black', height: '30vh', padding: 2 }}><b>In Progress</b></Card>
                        </Grid>
                        <Grid item xs={4} >
                            <Card sx={{ border: '1px black', height: '30vh', padding: 2 }}><b>Completed</b></Card>
                        </Grid> */}
                            <Grid item xs={12}>
                                <div>
                                    <div
                                        style={{ display: "flex", justifyContent: "center" }}
                                    >
                                        {/* https://codesandbox.io/p/sandbox/react-8b6r1?file=%2Fsrc%2FApp.js%3A92%2C32 */}
                                        <DragDropContext
                                            onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                                        >
                                            {Object.entries(columns).map(([columnId, column], index) => {
                                                return (

                                                    <Grid item xs={4} sx={{ '&.MuiPaper-root': { boxShadow: '2px black' }, }} >
                                                        <Card sx={{ height: '35vh', padding: 3, ml: 1, mr: 1, backgroundColor: 'white' }} >
                                                            <Typography sx={{ mb: 1, color: 'secondary.main' }}><b>{column.name}</b><Chip size="small" label={column.items.length} sx={{ ml: 1 }} /></Typography>

                                                            <Divider sx={{ mb: 2 }} />
                                                            <div >
                                                                <Droppable droppableId={columnId} key={columnId}>
                                                                    {(provided, snapshot) => {
                                                                        return (
                                                                            <div
                                                                                {...provided.droppableProps}
                                                                                ref={provided.innerRef}
                                                                                style={{
                                                                                    background: snapshot.isDraggingOver
                                                                                        ? "white"
                                                                                        : "white",
                                                                                    padding: 4,
                                                                                    height: '28vh',
                                                                                    overflow: 'auto',
                                                                                    minWidth: 200
                                                                                }}
                                                                            >
                                                                                {column.items.map((item, index) => {
                                                                                    return (
                                                                                        <Draggable
                                                                                            key={item.id}
                                                                                            draggableId={item.id}
                                                                                            index={index}
                                                                                        >
                                                                                            {(provided, snapshot) => {
                                                                                                return (
                                                                                                    <div
                                                                                                        ref={provided.innerRef}
                                                                                                        {...provided.draggableProps}
                                                                                                        {...provided.dragHandleProps}
                                                                                                        style={{
                                                                                                            userSelect: "none",
                                                                                                            padding: 13,
                                                                                                            margin: "0 0 8px 0",
                                                                                                            minHeight: "50px",
                                                                                                            backgroundColor: snapshot.isDragging
                                                                                                                ? "#FFFFFF"
                                                                                                                : "#FFFFFF",
                                                                                                            color: "black",
                                                                                                            ...provided.draggableProps.style,
                                                                                                            borderRadius: 4,
                                                                                                            // boxShadow:'2px 2px 5px -4px rgba(0,0,0,0.75)',
                                                                                                            border: '1px #d9d9d9 solid',

                                                                                                        }}
                                                                                                    >
                                                                                                        <Typography >{item.content}</Typography>
                                                                                                        <Chip size="small" label={item.subject} sx={{ mt: 1, fontSize: 12, backgroundColor: `${subjectColor(item.subject)}` }} />
                                                                                                        <Typography textAlign={'right'} sx={{ float: 'right', padding: 1, fontSize: 12, mt: '3px' }}>{item.daysLeft} days left</Typography>
                                                                                                    </div>
                                                                                                );
                                                                                            }}
                                                                                        </Draggable>
                                                                                    );
                                                                                })}
                                                                            </div>
                                                                        );
                                                                    }}
                                                                </Droppable>
                                                            </div>
                                                        </Card></Grid>


                                                );
                                            })}
                                        </DragDropContext>
                                    </div>
                                </div></Grid>
                            {/* <Grid item xs={6}>
                                <Typography variant={'h5'} sx={{ mb: 1, ml: 1, color: 'secondary.main' }}>Statistics</Typography>

                                <Card sx={{ border: '1px black', height: '25vh', padding: 3, ml: 1,mt:2 }}>

                                </Card>

                            </Grid>
                            <Grid item xs={6}>
                                <Typography variant={'h5'} sx={{ mb: 1, color: 'secondary.main' }}>Today's Agenda</Typography>

                                <Card sx={{ border: '1px black', height: '25vh', padding: 3, mr: 1,mt:2 }}>

                                </Card>

                            </Grid> */}
                            <Grid item xs={6}>
                                <Card sx={{ border: '1px black', height: '30vh', padding: 3, ml: 1 }}>
                                    <Typography sx={{ mb: 1, color: 'secondary.main' }}><b>Statistics</b></Typography>

                                    <Divider />
                                    <img src={StatsPlaceholder} alt="Description of Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />

                                </Card>

                            </Grid>
                            <Grid item xs={6}>

                                <Card sx={{ border: '1px black', height: '30vh', padding: 3, mr: 1 }}>
                                    <Typography sx={{ mb: 1, color: 'secondary.main' }}><b>Today's Agenda</b></Typography>
                                    <Divider />
                                    <List dense={false}>

                                        <ListItem>
                                            <ListItemIcon>
                                                <ScheduleIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Assignment 2"
                                            />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <ScheduleIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Lab 3"
                                            />
                                        </ListItem>     <ListItem>
                                            <ListItemIcon>
                                                <ScheduleIcon />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary="Project Outline"
                                            />
                                        </ListItem>

                                    </List>
                                </Card>

                            </Grid>

                            {/* <Grid item xs={12}>
                                <Typography>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nulla euismod tortor augue, eu commodo dui aliquam sit amet. Donec semper lacus vel est aliquet, sed vestibulum quam hendrerit. Nunc scelerisque rutrum lacus. Mauris maximus vulputate cursus. Morbi sodales consequat sapien et imperdiet. Integer semper sit amet est sit amet porttitor. Sed vel turpis ultricies nunc commodo tempor eget vulputate sem. Fusce turpis enim, placerat ut consectetur in, bibendum non nisi. Sed vitae nisl nisi. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Maecenas at mauris dolor. Sed sed nulla porta, scelerisque neque sit amet, rhoncus enim. Nullam varius pretium erat in laoreet. Nunc sit amet fermentum tortor, id sollicitudin libero. Integer mattis odio ac malesuada semper. Proin viverra, sem id elementum maximus, nulla magna eleifend nisi, a venenatis leo velit at ex.

                                    Integer scelerisque odio non condimentum sodales. Integer facilisis tortor tellus, non volutpat dui tristique quis. Nam in pharetra lorem. Cras consequat diam arcu, ut malesuada turpis fringilla id. Maecenas sed nisi suscipit, luctus mauris ac, fermentum elit. Pellentesque in accumsan elit, ut accumsan nisl. Vestibulum nunc nisl, aliquet ac scelerisque non, maximus ut augue. Donec semper metus quis ipsum ultricies, ac vulputate tortor lacinia. Nam vel suscipit dolor, non tincidunt ante. Proin tincidunt metus a ligula posuere pharetra. In iaculis eget tellus vulputate posuere. Morbi aliquam metus vitae justo ultrices, vehicula consequat enim faucibus. Cras feugiat turpis lacus. Sed sollicitudin ante enim, ut egestas ipsum faucibus nec. Vestibulum pharetra ligula et vehicula finibus.

                                    Quisque quis posuere urna. Donec id posuere turpis. Suspendisse fermentum neque sed lacinia fermentum. Cras placerat velit vitae tellus sodales, at consequat massa tincidunt. Aliquam sit amet lorem nec mauris sollicitudin porta. Sed sed tellus ultrices, condimentum magna nec, dignissim est. Phasellus ullamcorper molestie augue nec dictum. Sed euismod vestibulum sapien sit amet porta. Nunc metus ligula, mattis consequat interdum fringilla, porttitor nec diam. Proin et sapien nisl. Nulla sit amet ultricies leo. Fusce pharetra pharetra elit at commodo.

                                    Etiam tincidunt eu sem non luctus. In eget egestas sem, vel tincidunt sem. Nullam odio erat, pretium vitae faucibus vitae, cursus non enim. Mauris nec rhoncus lacus, a suscipit augue. Nullam vel enim euismod, volutpat elit in, iaculis nisi. Sed sagittis posuere risus eget consequat. Nulla fermentum nulla turpis, sit amet lobortis sem scelerisque sed. Donec nec ipsum purus. Curabitur in mauris vitae orci viverra dignissim. Curabitur varius massa turpis, non tempor nunc maximus ac. Nam commodo pretium condimentum. Mauris eget massa eu mi posuere varius eu sit amet nisl.

                                    Praesent eu mi ac sapien egestas vestibulum sed vitae arcu. Ut eget mollis sapien. Quisque pellentesque augue id quam venenatis, eget convallis augue viverra. Quisque mi neque, interdum quis fermentum porttitor, condimentum lacinia justo. Sed tincidunt ipsum velit. Donec nec dui commodo, finibus neque vel, rutrum magna. Nulla sit amet bibendum metus. Fusce auctor nunc mi, eget sagittis nunc efficitur sit amet. Mauris faucibus aliquam sem at commodo. Nunc ipsum odio, vulputate eu molestie cursus, finibus sit amet nulla. Phasellus justo nisi, placerat at purus ac, egestas sagittis magna. Nam justo dui, dignissim eget rutrum eget, dignissim in leo.</Typography>
                            </Grid> */}
                        </Grid>
                    </Box>

                    <Box id="rightNavbar" sx={{ boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                        <RightNavbar />
                    </Box>
                </Box>
            </div></ThemeProvider>
    )
}