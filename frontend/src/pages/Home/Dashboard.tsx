import React, { useEffect, useState } from 'react';
import { Navbar, RightNavbar, MidTopSection } from '../../Navbar';
import { Box, Divider, Grid, Typography, Card, Chip } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";


export const Dashboard = () => {

    useEffect(() => {
    }, []);
    const tasks = [
        { id: "1", content: "First task" },
        { id: "2", content: "Second task" },
        { id: "3", content: "Third task" },
        { id: "4", content: "Fourth task" },
        { id: "5", content: "Fifth task" }
    ];

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
        <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

            <Box sx={{ display: 'flex', width: '100%' }}>
                <Box id="navbar" sx={{ width: 300 }}>
                    <Navbar />
                </Box>
                <Box sx={{ width: '80%' }}>
                    <Box>
                        <MidTopSection />
                        <Divider />
                        {/* Dashboard content here */}
                    </Box>  <Grid container spacing={3} sx={{ padding: 5 }}>
                        <Grid item xs={12}>
                            <Typography variant='h5'>This Week</Typography>
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
                                    <DragDropContext
                                        onDragEnd={(result) => onDragEnd(result, columns, setColumns)}
                                    >
                                        {Object.entries(columns).map(([columnId, column], index) => {
                                            return (

                                                <Grid item xs={4} sx={{ '&.MuiPaper-root': { boxShadow: '2px black' }, }} >
                                                    <Card sx={{ height: '40vh', padding: 3, ml: 1, mr: 1 }} >
                                                        <Typography sx={{ mb: 1, }}><b>{column.name}</b><Chip size="small" label={column.items.length} sx={{ ml: 1 }} /></Typography>

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
                                                                                    ? "lightblue"
                                                                                    : "white",
                                                                                padding: 4,
                                                                                height: '33vh',
                                                                                overflow: 'auto',
                                                
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
                                                                                                        padding: 16,
                                                                                                        margin: "0 0 8px 0",
                                                                                                        minHeight: "50px",
                                                                                                        backgroundColor: snapshot.isDragging
                                                                                                            ? "#263B4A"
                                                                                                            : "#456C86",
                                                                                                        color: "white",
                                                                                                        ...provided.draggableProps.style,
                                                                                                        borderRadius: 4,

                                                                                                    }}
                                                                                                >
                                                                                                    {item.content}
                                                                                                </div>
                                                                                            );
                                                                                        }}
                                                                                    </Draggable>
                                                                                );
                                                                            })}
                                                                            {provided.placeholder}
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
                    </Grid>
                </Box>
                <Box id="rightNavbar" sx={{ width: 300, boxShadow: '0px 0px 1px rgba(0,0,0,0.5)' }}>
                    <RightNavbar />
                </Box>
            </Box>
        </div>
    )
}