import { Box, Container, Divider, IconButton, Typography } from "@mui/material";
import MoreVertIcon from '@mui/icons-material/MoreVert';
import CreateIcon from '@mui/icons-material/Create';
import React, { useEffect, useState } from "react";
import Dropdown from '@mui/joy/Dropdown';
import Menu from '@mui/joy/Menu';
import MenuButton from '@mui/joy/MenuButton';
import MenuItem from '@mui/joy/MenuItem';
import { REACT_APP_BACKEND_DEV_URL } from "../constants/envConsts";

const ITEM_HEIGHT = 48;

type Task = {
    id: string,
    taskName: string,
    subjectName: string,
    colour: string,
    dueDate: string,
    notes: string
}

const Assignment = () => {

    const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);
    const [tasks, setTasks] = useState<Task[]>([])
    const [email, setEmail] = useState<string>('');
    const [selectedTask, setSelectedTask] = useState<Task>();

    async function fetchData(receivedEmail: string) {
        try {
            const apiUrl = `${REACT_APP_BACKEND_DEV_URL}/task/getAllByOwner?ownerEmail=${receivedEmail}`;
            const response = await fetch(apiUrl, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            const tasks = data?.data;

            if (!tasks || !Array.isArray(tasks)) {
                throw new Error('Invalid data format received from the server');
            }

            const mappedTasks: Task[] = tasks
                .filter((task: any) => task.taskStatus !== 'completed')
                .map((task: any) => ({
                    id: task?._id,
                    taskName: task?.taskName,
                    subjectName: task?.subjectName,
                    colour: task?.colour,
                    dueDate: task?.dueDate,
                    notes: task?.notes
                }));

            setTasks(mappedTasks);

            if (mappedTasks.length !== 0) {
                chrome.storage.sync.get('selectedTask', (result) => {
                    const storedTask = result.selectedTask;
                    if (storedTask === null) {
                        // if selectedTask in chrome storage is null, set the first task from mappedTasks and store it in chrome storage
                        const firstTask = mappedTasks[0];
                        chrome.storage.sync.set({ selectedTask: firstTask });
                        setSelectedTask(firstTask);
                    } else {
                        // if selectedTask is not null, set it from chrome storage
                        setSelectedTask(storedTask);
                    }
                });
            }
            
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    useEffect(() => {
        async function fetchDataAndSetEmail() {
            // Retrieve the user email
            const data = await new Promise<{ currentUser: string }>((resolve) => {
                chrome.storage.sync.get("currentUser", (data) => {
                    resolve({ currentUser: data.currentUser });;
                });
            });

            setEmail(data.currentUser);
            await fetchData(data.currentUser);
        }

        fetchDataAndSetEmail();

        return () => {
        };
    }, [email]);

    const open = Boolean(anchorEl);
    const handleClick = (event: React.MouseEvent<HTMLElement>) => {
        setAnchorEl(event.currentTarget);
    };
    const handleClose = () => {
        setAnchorEl(null);
    };

    const handleMenuItemClick = (index: number) => {
        setSelectedTask(tasks[index]);
        chrome.storage.sync.set({ selectedTask: tasks[index] });
    }

    function daysLeftUntilDate(targetDateStr: string): number {
        const targetDate = new Date(targetDateStr);
        const today = new Date();
        
        // Set both dates to midnight to compare only the date portion
        today.setHours(0, 0, 0, 0);
        targetDate.setHours(0, 0, 0, 0);

        const todayMs = today.getTime();
        const targetDateMs = targetDate.getTime();
        const differenceMs = targetDateMs - todayMs;
        const daysDifference = Math.ceil(differenceMs / (1000 * 60 * 60 * 24));

        return daysDifference;
    }

    return (
        <div style={{ width: '90%', marginLeft: '10px', marginTop: '10px' }}>

            {/* first section: currently working on  */}
            <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Typography
                    sx={{
                        color: "#A3A3A3",
                        fontSize: '14px',
                    }}
                >
                    Currently working on
                </Typography>
                <Dropdown>
                    <MenuButton
                        variant="plain"
                        size="sm"
                    >
                        <MoreVertIcon sx={{ fontSize: '20px' }} />
                    </MenuButton>
                    <Menu
                        sx={{
                            maxHeight: ITEM_HEIGHT * 4.5,
                            overflowY: 'auto'
                        }}
                    >
                        {tasks.length === 0 ? (
                            <MenuItem disabled sx={{ fontSize: '14px' }}>
                                No tasks available
                            </MenuItem>
                        ) : (
                            tasks.map((task: Task, index: number) => (
                                <MenuItem
                                    key={index}
                                    selected={task.id === selectedTask?.id} 
                                    onClick={() => handleMenuItemClick(index)}
                                    sx={{ fontSize: '14px' }}
                                >
                                    {task.taskName} 
                                </MenuItem>
                            ))
                        )}
                    </Menu>
                </Dropdown>
            </Box>

            {/* second section: assignment name */}
            <Typography
                sx={{
                    fontSize: '18px',
                    fontWeight: '500'
                }}
            >
                {selectedTask ? selectedTask.taskName : "No Tasks Available"}
            </Typography>

            {/* third section: assignment tag and days left */}
            {selectedTask && (
                <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '8px' }} >
                    <Typography
                        sx={{
                            fontSize: '12px',
                            backgroundColor: `${selectedTask.colour}`,
                            borderRadius: '11px',
                            paddingTop: '1px',
                            paddingBottom: '1px',
                            paddingLeft: '7px',
                            paddingRight: '7px'
                        }}
                    >
                        {selectedTask.subjectName}
                    </Typography>
                    <Typography
                        sx={{
                            color: '#787486',
                            fontSize: '14px'
                        }}
                    >
                        {daysLeftUntilDate(selectedTask.dueDate) >= 0 ? (
                            `${daysLeftUntilDate(selectedTask.dueDate)} days left`
                        ) : (
                            "Overdue!"
                        )}
                    </Typography>
                </Box>
            )}

            {/* fourth section: notes title*/}
            <Box sx={{ display: 'flex', marginTop: '25px' }}>
                <Typography
                    sx={{
                        color: '#A3A3A3',
                        fontSize: '14px'
                    }}
                >
                    Notes
                </Typography>
                <CreateIcon sx={{ fontSize: '14px', color: '#787486', marginLeft: '5px', marginTop: '4px' }} />
            </Box>
            <Divider sx={{ marginTop: '5px' }} />

            {/* fifth section: notes */}
            <Box sx={{ display: 'flex', marginTop: '15px' }}>
                <Typography
                    sx={{
                        fontSize: '12px'
                    }}
                >
                    {/* Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. */}
                    {selectedTask ? (
                        selectedTask.notes ? selectedTask.notes : "No notes"
                    ) : (
                        "Create tasks on Thrive's webpage to view here!"
                    )}
                </Typography>
            </Box>

        </div>
    );
}

export default Assignment;