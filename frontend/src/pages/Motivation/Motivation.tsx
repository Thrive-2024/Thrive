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
    Autocomplete
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
    sender: string;
    variant: number;
}

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

export const Motivation = (props: any) => {

    const [messages, setMessages] = useState<Message[]>([]);
    const [enlarged, setEnlarged] = useState<boolean>(false);
    const [chosen, setChosen] = useState<Message | null>(null);
    const [open, setOpen] = useState<boolean>(false);

    const [userFriends, setUserFriends] = useState<string[]>([]);
    const [sendMessageContent, setSendMessageContent] = useState<string>();
    useEffect(() => {
        const fetchMessages = async () => {
            try {
                const response = await fetch(
                    `${process.env.REACT_APP_BACKEND_DEV_URL}/motivation/getAllByReceiver?receiver=james@gmail.com`
                );
                const input = await response.json();
                let data = input.data;
                data = data.slice(0, 20);
                const mappedMessages = data.map(
                    (msg: any, index: number): Message => ({
                        id: index,
                        content: msg.message,
                        dateSent: msg.createdDateTime,
                        sender: msg.sender,
                        variant: Math.floor(Math.random() * 5)
                        // senderName:  msg.senderName === 'SYSTEM' ? 'Dive' : msg.senderName, // Replace 'SYSTEM' with 'DIVE'
                        // x: Math.random() * 100,
                        // y: Math.random() * 100, // left the x y as random bc data is all 0s, just change to msg.x/y
                    })
                );
                setMessages(mappedMessages);
                console.log(mappedMessages);
            } catch (error) {
                console.error("Failed to fetch messages:", error);
            }
        };

        const fetchFriends = async () => {
            const data: string[] = ["Alice", "Brian", "Crayon", "Danielle"];
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


    const handlePostEnlarge = (post: Message | null) => {
        if (post) {
            setEnlarged(true);
            setChosen(post);
        }
    };

    const handlePostClose = (post: Message | null) => {
        if (post) {
            setEnlarged(false);
            setChosen(null);
        }
    }

    const handleOpen = () => setOpen(true);
    const handleClose = () => setOpen(false);

    const handleNotesChange = (event: any) => {
        setSendMessageContent(event.target.value);
    }

    //send post
    const handleSendPost = (event: any) => {
        event.preventDefault()
        console.log("handleSendPost called")
        setOpen(false);

    }

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

                        <Button sx={{ margin: '0', mr: 1, height: 32, width: '30%', minWidth: 100, textTransform: 'none', color: 'white' }} variant="contained" onClick={handleOpen}> Send a Message </Button>
                    </Grid>

                    {/* the wall */}
                    <Box sx={{
                        height: '50vh',
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
                    }}
                        onClick={() => handlePostClose(chosen)}>

                        <Grid container spacing={0}>
                            {messages.map((message, index) => (
                                <Grid item sm={12} md={6} lg={4} key={index} sx={{ height: '100%' }}>
                                    <Box
                                        sx={{
                                            position: "relative",
                                            padding: "5px",
                                            overflow: 'hidden',
                                        }}
                                        onClick={() => handlePostEnlarge(message)}
                                    >
                                        <ImageWithTextOverlay
                                            variant={message?.variant}
                                            text={message?.content}
                                        />
                                    </Box>
                                </Grid>
                            ))}
                        </Grid>

                        {enlarged &&
                            <Typography sx={{
                                padding: '5px',
                                position: 'absolute',
                                left: '38%',
                                top: '38%',
                                maxWidth: '20%',
                                whiteSpace: 'normal', // Allow text wrapping
                                background: 'rgba(243, 244, 246, 0.7)',
                                borderRadius: '5px',
                                zIndex: 99
                            }} >
                                {chosen?.content}
                            </Typography>
                        }
                    </Box>
                </Grid>

                {/* send post to friend modal */}
                <Modal
                    open={open}
                    onClose={handleClose}
                    aria-labelledby="modal-modal-title"
                    aria-describedby="modal-modal-description"
                >
                    <Box sx={modalStyle}>
                        <FormControl>
                            <Grid container spacing={2} sx={{ padding: 5, pt: 4, alignItems: 'center' }} >
                                <Grid item xs={12}>
                                    {/* Choose a friend to send to */}
                                    <Autocomplete
                                        disablePortal
                                        id="combo-box-demo"
                                        options={userFriends}
                                        renderInput={(params) => <TextField {...params} label="Choose a Friend" />}
                                    />
                                </Grid>
                                <Grid item xs={6} sx={{ paddingX: 2 }}>
                                    {/* Post it selection */}
                                    <Post
                                        variant={4}
                                    />
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
            </div>
        </ThemeProvider >
    );

};

