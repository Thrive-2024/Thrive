import React, { useEffect, useState } from 'react';
import { Box, Button, Divider, Grid, Typography, Card, Chip, List, ListItem, ListItemIcon, ListItemText, Modal, Tooltip, TextField, Snackbar, Alert, MenuItem, Select, LinearProgress, FormControl } from '@mui/material';
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';
import dayjs from 'dayjs';

import ScheduleIcon from '@mui/icons-material/Schedule';

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

//styles for add task modal
const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 500,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};

//styles for processing modal
const processingStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
};
<style>
</style>

export const Dashboard = (props: any) => {
    //active user
    // const currentUser = props.currentUser;

    //task
    interface Task {
        _id: string;
        ownerEmail: string;
        taskName: string;
        subjectName: string;
        colour: string;
        dueDate: String; // Assuming dueDate is a Date object
        status: string;
        notes: string;
    }

    //task board interface
    interface TaskStatus {
        toDo: { name: string; items: Task[] };
        inProgress: { name: string; items: Task[] };
        done: { name: string; items: Task[] };
    }

    //task for drag and drop boards
    const [taskboard, setTaskBoard] = useState<TaskStatus>({
        toDo: { name: "To Do", items: [] },
        inProgress: { name: "In Progress", items: [] },
        done: { name: "Done", items: [] }
    });

    // task creation
    const [taskName, setTaskName] = useState('');
    const [selectedColor, setSelectedColor] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [subjectName, setSubjectName] = useState('');
    const [notes, setNotes] = useState('');

    const [allTasks, setAllTasks] = useState<Task[]>([]);
    const [tasksModified, setTasksModified] = useState(false);

    // task creation modal
    const [open, setOpen] = React.useState(false);
    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    //color selections
    const colorOptions = [
        { label: 'Red', value: '#FFC4C4' },
        { label: 'Green', value: '#CCFFCC' },
        { label: 'Yellow', value: '#FFFFCC' },
        { label: 'Orange', value: '#FFCC99' },
        { label: 'Purple', value: '#CCCCFF' },
        { label: 'Default', value: '#D7D7D7' }
    ];

    //allocate tasks to respective boards (todo, in progress,done)
    const allocateToTaskBoard = (fetchedTasks: Task[]) => {
        const updatedTaskList: TaskStatus = {
            toDo: { name: "To Do", items: [] },
            inProgress: { name: "In Progress", items: [] },
            done: { name: "Done", items: [] }
        };

        fetchedTasks.forEach((task: Task) => { // Explicitly type task as Task
            const status = task.status;
            if (status === 'toDo') {
                updatedTaskList.toDo.items.push(task); // No error here
            } else if (status === 'inProgress') {
                updatedTaskList.inProgress.items.push(task); // No error here
            } else if (status === 'done') {
                updatedTaskList.done.items.push(task); // No error here
            }
        });

        // allocateToTaskBoard(updatedTaskList);
        setTaskBoard(updatedTaskList);
    };

    //handle form inputs
    const handleColorChange = (event: any) => {
        setSelectedColor(event.target.value);
        // console.log(event.target.value);
    };

    const handleTaskNameChange = (event: any) => {
        setTaskName(event.target.value);
        // console.log(event.target.value);
    };

    const handleSubjectChange = (event: any) => {
        setSubjectName(event.target.value);
        // console.log(event.target.value);
    };

    const handleNotesChange = (event: any) => {
        setNotes(event.target.value);
        // console.log(event.target.value);
    };

    //task dragging function
    const onDragEnd = (result: any, taskboard: any, setTaskBoard: any) => {
        if (!result.destination) return;
        const { source, destination } = result;
        setTasksModified(true);
        console.log("task modified");

        if (source.droppableId !== destination.droppableId) {
            const sourceColumn = taskboard[source.droppableId];
            const destColumn = taskboard[destination.droppableId];
            const sourceItems = [...sourceColumn.items];
            const destItems = [...destColumn.items];
            const [removed] = sourceItems.splice(source.index, 1);
            destItems.splice(destination.index, 0, removed);
            setTaskBoard({
                ...taskboard,
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
            const column = taskboard[source.droppableId];
            const copiedItems = [...column.items];
            const [removed] = copiedItems.splice(source.index, 1);
            copiedItems.splice(destination.index, 0, removed);
            setTaskBoard({
                ...taskboard,
                [source.droppableId]: {
                    ...column,
                    items: copiedItems
                }
            });
        }
    };

    //create tasks
    const handleCreateTask = (event: any) => {
        event.preventDefault()
        console.log("handleCreateTask called")
        setOpenProcessingModal(true)

        console.log(dueDate.toString())

        // Check if any of the required variables are empty or empty strings
        if (!taskName.trim() || !subjectName.trim() || !selectedColor.trim() || !dueDate.trim()) {

            setAlertType('error');
            setAlertMsg("Task creation failed. Please check your inputs and try again.");
            setOpenSnackbar(true);

            setOpenProcessingModal(false)

            return; // Exit the function if any of the required fields are empty
        }

        const formData = new FormData();
        formData.append('ownerEmail', props.currentUser);
        formData.append('taskName', taskName);
        formData.append('subjectName', subjectName);
        formData.append('colour', selectedColor);
        formData.append('dueDate', dueDate);
        formData.append('notes', notes);

        fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/task/create`, {
            headers: {
            },
            method: 'POST',
            body: formData
        })
            .then(async (response) => {
                if (response.status != 200) {
                    const apiResponse = await response.json();
                    setOpenProcessingModal(false);
                    //show alert msg
                    setAlertType('error');
                    setAlertMsg("Task creation failed. Please check your inputs and try again.");
                    setOpenSnackbar(true);

                    // setAlertMsg(apiResponse['message']);
                } else {
                    const apiResponse = await response.json();
                    //show alert msg
                    setOpenSnackbar(true);
                    setAlertType('success');
                    setAlertMsg(`Task: ${taskName} created successfully`);

                    const newTask:Task = {
                        _id: apiResponse.id,
                        ownerEmail: props.currentUser,
                        taskName,
                        subjectName,
                        colour: selectedColor,
                        dueDate,
                        status: 'toDo',
                        notes
                    };
                    // fetchTask();
                    // Add the newly created task to the task board
                    setTaskBoard((prevState: any) => ({
                        ...prevState,
                        toDo: {
                            ...prevState.toDo,
                            items: [
                                ...prevState.toDo.items,
                                newTask
                            ]
                        }
                    }));

                    setAllTasks((prevTasks) => [...prevTasks, newTask]);

                    setSelectedColor('');
                    setTaskName('');
                    setSubjectName('');
                    setNotes('');
                    setDueDate('');

                    setOpenProcessingModal(false);
                    setOpen(false);

                }
            }
            )

    }

    //GET method to fetch all tasks and update 
    const fetchTask = async () => {
        console.log("task fetcher called");

        try {
            const response = await fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/task/getAllByOwner?ownerEmail=${props.currentUser}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'GET'
            });

            if (response.status == 404) {
                console.log("No tasks found")
                setAllTasks([]);
                setTaskBoard({
                    toDo: { name: "To Do", items: [] },
                    inProgress: { name: "In Progress", items: [] },
                    done: { name: "Done", items: [] }
                });
            }
            if (response.status != 200) {
                console.log("ERROR FETCHING TASKS");

            } else {
                const apiResponse = await response.json();
                console.log(apiResponse);
                const fetchedTasks = apiResponse.data;
                setAllTasks(fetchedTasks); //full task list
                allocateToTaskBoard(fetchedTasks); //allocate to respective task board
            }

        } catch (err) {
            window.alert(err);
            return null;
        }

    }

    //for remaining time left shown in draggable tasks
    const calculateTimeLeft = (dateString: string) => {
        const targetDate = new Date(dateString.split('T')[0]); // Extracting and parsing the date from the input string
        const currentDate = new Date(); // Current date

        // Calculate the difference in milliseconds
        const difference = targetDate.getTime() - currentDate.getTime();

        // Calculate days and weeks
        const daysLeft = Math.ceil(difference / (1000 * 60 * 60 * 24)); // Convert milliseconds to days
        const weeksLeft = Math.ceil(daysLeft / 7); // Convert days to weeks

        if (daysLeft < 0) {
            return "Overdue";
        } else if (daysLeft === 0) {
            return "Due today";
        } else if (daysLeft === 1) {
            return "1 day left";
        } else if (daysLeft <= 7) {
            return `${daysLeft} days left`;
        } else if (weeksLeft === 1) {
            return "1 week left";
        } else {
            return `${weeksLeft} weeks left`;
        }
    };

    const returnTasksForUpdate = () => {
        const tasksToUpdate = [] as { taskId: string; newStatus: string }[];

        // Iterate over each status and its items
        Object.entries(taskboard).forEach(([key, status]) => {
            status.items.forEach((task: { _id: string, status: string; }) => {
                tasksToUpdate.push({ taskId: task._id, newStatus: key });
            });
        });
        // console.log(tasksToUpdate)
        return tasksToUpdate;

    }

    const updateTasks = () => {
        // console.log("updateTasks called")
        const tasksToUpdate = returnTasksForUpdate();

        // console.log(tasksToUpdate);

        fetch(`${process.env.REACT_APP_BACKEND_DEV_URL}/task/updateTaskStatusBulk`, {
            headers: {
                'Content-Type': 'application/json',
            },
            method: 'PUT',
            body: JSON.stringify(tasksToUpdate)
        })
            .then(async (response) => {
                if (response.status != 200) {
                    const apiResponse = await response.json();
                    console.log(apiResponse)
                    console.log(tasksToUpdate);

                    console.log("Error updating task status");
                } else {
                    const apiResponse = await response.json();
                    console.log("Task status updated");
                    console.log(tasksToUpdate);

                    setTasksModified(false);

                }
            })
            .catch((error) => {
                // Handle any error that occurred during the update process
                window.alert(`Error during update tasks:${error}`);
            });

        setTasksModified(false);
    };

    //execute once
    useEffect(() => {
        console.log(props.currentUser)
        fetchTask()
    }, [props.currentUser]);

    // useEffect(() => {


    //     if (tasksModified) {
    //         console.log('Got tasks to update')
    //         updateTasks();
    //     } else{
    //         console.log('NO TASKS TO UPDATE');
    //     }

    //     // 10 seconds in milliseconds

    // }, [taskboard, tasksModified]); // Run whenever taskboard changes

    useEffect(() => {
        let timeoutId: any;
        // console.log('useeffect called')

        if (tasksModified) {
            // console.log('Got tasks to update');
            timeoutId = setTimeout(() => {
                updateTasks();
            }, 5000); // 10 seconds in milliseconds
        }

        return () => {
            clearTimeout(timeoutId);
        };
    }, [tasksModified, taskboard]);



    //processing modal and snackbar
    const [openProcessingModal, setOpenProcessingModal] = React.useState(false);

    //error , warning , info , success
    const [openSnackbar, setOpenSnackbar] = useState(false);
    const [alertType, setAlertType]: any = useState('info');
    const [alertMsg, setAlertMsg] = useState('');

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };



    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>

                <Grid container spacing={3} sx={{ padding: 5, pt: 4 }} >
                    <Grid item xs={6} >
                        <Typography variant='h5' sx={{ ml: 1 }}>This Week</Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right", verticalAlign: 'top' }} >

                        <Button sx={{ margin: '0', mr: 1, height: 32, width: '20%', minWidth: 100, textTransform: 'none', color: 'white' }} variant="contained" onClick={handleOpen}>Add Task</Button>
                    </Grid>

                    <Grid item xs={12}>
                        <div>
                            <div style={{ display: "flex", justifyContent: "center" }}>
                                {/* Drag and drop list: https://codesandbox.io/p/sandbox/react-8b6r1?file=%2Fsrc%2FApp.js%3A92%2C32 */}
                                <DragDropContext
                                    onDragEnd={(result) => onDragEnd(result, taskboard, setTaskBoard)}
                                >
                                    {Object.entries(taskboard).map(([columnId, column], index) => {
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
                                                                        {column.items.map((item: any, index: number) => {
                                                                            return (
                                                                                <Draggable
                                                                                    key={item._id}
                                                                                    draggableId={item._id}
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
                                                                                                <Typography >{item.taskName}</Typography>
                                                                                                <Chip size="small" label={item.subjectName} sx={{ mt: 1, fontSize: 12, backgroundColor: item.colour }} />
                                                                                                <Typography textAlign={'right'} sx={{ float: 'right', padding: 1, fontSize: 12, mt: '3px' }}>{calculateTimeLeft(item.dueDate)}</Typography>

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
                    
                    <Grid item xs={6}>
                        {/* Statistics */}
                        <Card sx={{ border: '1px black', height: '30vh', padding: 3, ml: 1 }}>
                            <Typography sx={{ mb: 1, color: 'secondary.main' }}><b>Statistics</b></Typography>

                            <Divider />
                            <img src={StatsPlaceholder} alt="Description of Image" style={{ maxWidth: '100%', maxHeight: '100%' }} />

                        </Card>

                    </Grid>
                    <Grid item xs={6}>
                        {/* Today's Agenda */}
                        <Card sx={{ border: '1px black', height: '30vh', padding: 3, mr: 1 }}>
                            <Typography sx={{ mb: 1, color: 'secondary.main',overflow:'auto' }}><b>Urgent Tasks</b></Typography>
                            <Divider />
                            <List dense={false} >
                                {
                                    allTasks.length > 0 ? (
                                        allTasks.sort((a:any, b:any) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()).slice(0,4).map((value:Task) => (
                                            <ListItem key={value._id}> {/* Assuming each task has a unique identifier */}
                                                <ListItemIcon>
                                                    <ScheduleIcon />
                                                </ListItemIcon>
                                                <ListItemText
                                                    primary={value.taskName} 
                                                />
                                            </ListItem>
                                        ))
                                    ) : (
                                        <Typography>No Items</Typography>
                                    )
                                }




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

                {/* add task modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <FormControl>
                            <Grid container spacing={2} sx={{ padding: 5, pt: 4 }} >
                                <Grid item xs={6} sx={{ mb: 2 }}>
                                    {/* Task Name */}
                                    <TextField
                                        id="outlined-basic1"
                                        label="Task"
                                        variant="outlined"
                                        size='small'
                                        onChange={handleTaskNameChange}
                                        fullWidth  // Explicitly set to take full width
                                    />
                                </Grid>
                                <Grid item xs={4} sx={{ mb: 2 }}>
                                    {/* Subject */}
                                    <TextField
                                        id="outlined-basic2"
                                        label="Subject"
                                        variant="outlined"
                                        size='small'
                                        onChange={handleSubjectChange}
                                        fullWidth  // Explicitly set to take full width
                                    />
                                </Grid>
                                <Grid item xs={2}>
                                    {/* Color */}
                                    <Select
                                        size='small'
                                        value={selectedColor}
                                        onChange={handleColorChange}
                                        displayEmpty
                                        inputProps={{ 'aria-label': 'Select color' }}
                                        renderValue={(selected) => (
                                            <Box style={{ backgroundColor: selected, width: 20, height: 20, borderRadius: '50%' }} />
                                        )}
                                    >
                                        <MenuItem value="" disabled>
                                            Select Color
                                        </MenuItem>
                                        {colorOptions.map((option, index) => (
                                            <MenuItem key={index} value={option.value}>
                                                <Box style={{ backgroundColor: option.value, width: 16, height: 16, borderRadius: '50%' }} />
                                                <Tooltip title={option.label}>
                                                    <span style={{ marginLeft: 8 }}>{option.label}</span>
                                                </Tooltip>
                                            </MenuItem>
                                        ))}
                                    </Select></Grid>
                                <Grid item xs={6}>
                                    {/* Notes */}
                                    <TextField
                                        id="outlined-multiline-static"
                                        label="Notes"
                                        multiline
                                        rows={12}
                                        placeholder="..."
                                        onChange={handleNotesChange}
                                        sx={{ width: '100%' }}
                                    />
                                </Grid>
                                <Grid item xs={6}>
                                    {/* Date */}
                                    <LocalizationProvider dateAdapter={AdapterDayjs} >
                                        <DateCalendar
                                            onChange={(newValue) => {
                                                // Convert the date to the desired format
                                                const formattedDate = dayjs(newValue).format('YYYY-MM-DDThh:mm:ss');
                                                setDueDate(formattedDate);
                                            }}
                                        />
                                    </LocalizationProvider>
                                </Grid>
                                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                    <Button sx={{ marginRight: 5, width: '20%', textTransform: 'none', color: 'white' }} variant="contained" onClick={handleCreateTask}>Add Task</Button>
                                </Grid>

                            </Grid></FormControl>
                    </Box>
                </Modal>
                {/* snackbar */}
                <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertType} sx={{ width: '100%' }}>
                        {alertMsg}
                    </Alert>
                </Snackbar>

                {/* processing modal */}
                <Modal
                    keepMounted
                    open={openProcessingModal}
                    aria-labelledby="loading"
                    aria-describedby="loading elderly data"
                >
                    <Box sx={processingStyle}>
                        <Typography id="processing" variant="h6" component="h2">
                            Processing data, please wait.
                        </Typography>
                        <LinearProgress />
                    </Box>
                </Modal>


            </div></ThemeProvider >
    )
}