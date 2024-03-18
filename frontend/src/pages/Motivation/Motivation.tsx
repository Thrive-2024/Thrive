import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
    Box,
    Grid,
    Typography,
    TextField,
    Button,
    Modal,
    FormControl,
    Autocomplete,
    Snackbar,
    Alert,
    Badge
} from "@mui/material";
import ImageWithTextOverlay from './ImageWithTextOverlay';
import Post from './Post';

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

interface Message {
    id: number;
    content: string;
    dateSent: string;
    senderName: string;
    variant: number;
}

//styles for add task modal
const modalStyle = {
    position: 'absolute' as 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 800,
    height: 550,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
};

export const Motivation = (props: any) => {

    // to store all the messages
    const [messages, setMessages] = useState<Message[]>([]);

    // to view an enlarged message
    const [chosen, setChosen] = useState<Message | null>(null);
    const [viewPostEnlargeOpen, setViewPostEnlargeOpen] = useState<boolean>(false);

    // to create messages for friends
    const [createPostOpen, setCreatePostOpen] = useState<boolean>(false);
    const [userFriends, setUserFriends] = useState<string[]>([]);
    const [openSnackbar, setOpenSnackbar] = useState<boolean>(false);
    const [successMsgContent, setSuccessMsgContent] = useState<string>();
    const [alertType, setAlertType]: any = useState('info');

    // created msg content
    const [receivingFriend, setReceivingFriend] = useState<string | null>('');
    const [sendMessageContent, setSendMessageContent] = useState<string>('');
    const [sendMessageVariant, setSendMessageVariant] = useState<number>(-1);

    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_PRODUCTION_URL}/motivation/getAllByReceiver?receiver=${props.currentUser}`
                );
                const input = await response.json();
                let data = input.data;
                data = data.slice(0, 20);
                const mappedMessages = data.map(
                    (msg: any, index: number): Message => ({
                        id: index,
                        content: msg.message,
                        dateSent: msg.createdDateTime,
                        senderName: msg.senderName === 'SYSTEM' ? 'Dive' : msg.senderName, // Replace 'SYSTEM' with 'DIVE'
                        variant: msg.variant
                    })
                );
                setMessages(mappedMessages);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        const fetchFriends = async () => {
            const data: string[] = ["Alice", "Brian", "Crayon", "tim@gmail.com"];
            setUserFriends(data);
        }

        fetchMessages();
        fetchFriends();
    }, []);
    // useEffect(() => {
    //     const fetchMessages = async () => {
    //         const data: Message[] = [
    //             {
    //                 id: "1",
    //                 content:
    //                     "Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.",
    //                 dateSent: "1997-12-23",
    //                 sender: "Jonathan Osborne",
    //                 variant: 5
    //             },
    //             {
    //                 id: "2",
    //                 content:
    //                     "Field set marriage detail. Example Mr crime wear war concern above yourself. That better two behind establish popular probably.",
    //                 dateSent: "2017-10-18",
    //                 sender: "Katherine Smith",
    //                 variant: 4
    //             },
    //             {
    //                 id: "3",
    //                 content:
    //                     "Notice state meet really. Might over article may now choose. Late beautiful picture available.",
    //                 dateSent: "1999-06-26",
    //                 sender: "Tammy Rodriguez",
    //                 variant: 3
    //             },
    //             {
    //                 id: "4",
    //                 content:
    //                     "Expert campaign sure difficult miss effort. Effect culture red reality.",
    //                 dateSent: "2007-09-29",
    //                 sender: "Ashley Mccarthy",
    //                 variant: 2
    //             },
    //             {
    //                 id: "5",
    //                 content:
    //                     "Author either draw agree enter sure include baby. Seem itself office one popular dinner.",
    //                 dateSent: "1972-09-17",
    //                 sender: "Jill Alvarez",
    //                 variant: 1
    //             },
    //             {
    //                 id: "6",
    //                 content: "Suffer most window spend.",
    //                 dateSent: "2014-06-18",
    //                 sender: "Christopher Andrade",
    //                 variant: 5
    //             },
    //             {
    //                 id: "7",
    //                 content:
    //                     "Nor like it turn evidence color clearly simple. Teacher consider miss state personal.",
    //                 dateSent: "1970-02-22",
    //                 sender: "Shawn Alexander",
    //                 variant: 2
    //             },
    //             {
    //                 id: "8",
    //                 content: "Close court perform well small participant.",
    //                 dateSent: "1977-05-05",
    //                 sender: "Barbara Harper",
    //                 variant: 3
    //             },
    //             {
    //                 id: "9",
    //                 content:
    //                     "Deal record much woman. Else statement defense situation standard south off.\nPass character message long. Other next away.",
    //                 dateSent: "2009-12-24",
    //                 sender: "Heather Jones",
    //                 variant: 4
    //             },
    //             //mock messages here
    //         ];
    //         setMessages(data);
    //     };

    //     fetchMessages();
    // }, []);


    const handleViewPostEnlargeOpen = (post: Message | null) => {
        if (post) {
            setViewPostEnlargeOpen(true);
            setChosen(post);
        }
    };

    const handleViewPostEnlargeClose = () => {
        setViewPostEnlargeOpen(false);
    }

    const handleOpenCreatePost = () => setCreatePostOpen(true);
    const handleCloseCreatePost = () => setCreatePostOpen(false);

    const handleNotesChange = (event: any) => {
        setSendMessageContent(event.target.value);
    }

    //send post
    const handleSendPost = (event: any) => {
        event.preventDefault()

        // Check if any of the required variables are empty or empty strings
        if (receivingFriend == null || !receivingFriend.trim() || !sendMessageContent.trim() || sendMessageVariant === -1) {

            setAlertType('error');
            setSuccessMsgContent("Message failed to send. Please check your inputs and try again.");
            setOpenSnackbar(true);
            return; // Exit the function if any of the required fields are empty

        }

        // collect the information for a message
        const formData = new FormData();
        formData.append('receiver', receivingFriend);
        formData.append('sender', props.currentUser);
        formData.append('message', sendMessageContent);
        formData.append('variant', String(sendMessageVariant));

        console.log('sending data', formData.get('variant'));
        fetch(`${process.env.REACT_APP_BACKEND_PRODUCTION_URL}/motivation/create`, {
            headers: {
            },
            method: 'POST',
            body: formData
        })
            .then(async (response) => {
                if (response.status != 200) {

                    //show alert msg
                    setAlertType('error');
                    setSuccessMsgContent("Message failed to send. Please check your inputs and try again.");
                    setOpenSnackbar(true);

                } else {
                    //show alert msg
                    setOpenSnackbar(true);
                    setAlertType('success');
                    setSuccessMsgContent(`Message was sent successfully`);

                    // return to default values
                    setReceivingFriend('');
                    setSendMessageVariant(-1);
                    setSendMessageContent('');

                    // close the box
                    setCreatePostOpen(false);
                }
            }
            )

    }

    const handleSnackbarClose = () => {
        setOpenSnackbar(false);
    };

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'row', maxHeight: '100vh' }}>
                <Grid container spacing={3} sx={{ py: 2, px: 5 }}>

                    <Grid item xs={6} >
                        <Typography variant="h5" sx={{ ml: 1, mb: 1.5 }}>
                            Your Wall
                        </Typography>
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right", verticalAlign: 'top' }} >

                        <Button sx={{ margin: '0', mr: 1, height: 32, width: '30%', minWidth: 100, textTransform: 'none', color: 'white' }} variant="contained" onClick={handleOpenCreatePost}> Send a Message </Button>
                    </Grid>

                    {/* the wall */}
                    <Box sx={{
                        height: '70vh',
                        overflow: 'auto',
                        background: '#F7F7F7',
                        borderRadius: '10px',
                        '&::-webkit-scrollbar': {
                            width: '10px',
                        },
                        '&::-webkit-scrollbar-track': {
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb': {
                            background: '#C7D9E9',
                            borderRadius: '10px',
                        },
                        '&::-webkit-scrollbar-thumb:hover': {
                            background: '#95B6D4',
                        },
                    }}>

                        <Grid container spacing={0}>
                            {messages.map((message, index) => (
                                <Grid item sm={12} md={6} lg={4} key={index} sx={{ height: '100%' }}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            padding: "5px",
                                            overflow: 'hidden',
                                        }}
                                        onClick={() => handleViewPostEnlargeOpen(message)}
                                    >
                                        <ImageWithTextOverlay
                                            variant={message?.variant}
                                            text={message?.content}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>
                    </Box>
                </Grid>

                {/* send post to friend modal */}
                <Modal
                    open={createPostOpen}
                    onClose={handleCloseCreatePost}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <FormControl>
                            <Grid container spacing={2} sx={{ padding: 5, pt: 4, alignItems: 'center' }} >
                                <Grid item xs={12}>
                                    <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Sending a Message</Typography>
                                </Grid>
                                <Grid item xs={12}>
                                    {/* Choose a friend to send to */}
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={userFriends}
                                        value={receivingFriend}
                                        onChange={(event: any, newValue: string | null) => {
                                            setReceivingFriend(newValue);
                                        }}
                                        renderInput={(params) => <TextField {...params} label="Choose a Friend" />}
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{ paddingX: 2 }}>
                                    {/* Post it selection */}

                                    <Grid container spacing={1}>
                                        {[1, 2, 3, 4, 5].map((variantElement, index) => (
                                            <Grid item sm={12} md={6} lg={4} key={index} sx={{ height: '100%' }}>
                                                <Box
                                                    sx={{
                                                        position: "relative",
                                                        padding: "5px",
                                                    }}
                                                    onClick={() => setSendMessageVariant(variantElement)}
                                                >
                                                    <Post
                                                        variant={variantElement}
                                                    />

                                                    {variantElement === sendMessageVariant && (
                                                        <Box
                                                            sx={{
                                                                position: 'absolute',
                                                                top: 0,
                                                                left: 0,
                                                                width: '100%',
                                                                height: '100%',
                                                                display: 'flex',
                                                                justifyContent: 'center',
                                                                alignItems: 'center',
                                                                zIndex: 1,
                                                                border: '2px solid #95B6D4', 
                                                                borderRadius: 2,
                                                            }}>
                                                            <Typography sx={{
                                                                margin: '10px',
                                                                color: theme.palette.text.secondary,
                                                                background: '#95B6D4',
                                                                borderRadius: 2,
                                                                padding: '5px',
                                                            }}>
                                                                Selected
                                                            </Typography>
                                                        </Box>
                                                    )}
                                                </Box>
                                            </Grid>
                                        ))}
                                    </Grid>

                                </Grid>
                                <Grid item xs={6}>
                                    {/* Message */}
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
                                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                    <Button sx={{ width: '20%', textTransform: 'none', color: 'white' }} variant="contained" onClick={handleSendPost}>Send Post</Button>
                                </Grid>
                            </Grid>
                        </FormControl>
                    </Box>
                </Modal>

                {/* enlarge friend's post modal */}
                <Modal
                    open={viewPostEnlargeOpen}
                    onClose={handleViewPostEnlargeClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <Grid container spacing={2} sx={{ padding: 5, pt: 4, alignItems: 'center', justifyContent: 'center' }} >
                            <Grid item xs={12}>
                                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Message from your friend:</Typography>
                            </Grid>
                            <Grid item xs={4}>
                                {/* Sender name */}
                                <Typography>Sender: </Typography>
                            </Grid>
                            <Grid item xs={8}>
                                {/* Sender name */}
                                <Typography>{chosen?.senderName} </Typography>
                            </Grid>
                            <Grid item xs={6} sx={{ justifyContent: 'center' }}>
                                {/* Message */}
                                <ImageWithTextOverlay
                                    variant={chosen?.variant}
                                    text={chosen?.content}
                                />
                            </Grid>
                            <Grid item xs={12} sx={{ textAlign: 'right' }}>
                                <Button sx={{ width: '20%', textTransform: 'none', color: 'white' }} variant="contained" onClick={handleViewPostEnlargeClose}>Close</Button>
                            </Grid>
                        </Grid>
                    </Box>
                </Modal>


                {/* snackbar */}
                <Snackbar open={openSnackbar} autoHideDuration={2000} onClose={handleSnackbarClose}>
                    <Alert onClose={handleSnackbarClose} severity={alertType} sx={{ width: '100%' }}>
                        {successMsgContent}
                    </Alert>
                </Snackbar>

            </div>
        </ThemeProvider >
    );

};

