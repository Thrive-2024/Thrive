import React, { useState, useEffect } from 'react';
import { ThemeProvider, createTheme } from "@mui/material/styles";
import {
    Box,
    Divider,
    Grid,
    Typography,
    Card,
    CardContent,
    Stack,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    TextField,
    Fab,
    Button,
    Tooltip,
} from "@mui/material";
import ImageWithTextOverlay from './ImageWithTextOverlay';

// Images
import Blue1 from './Blue1.png';
import Blue2 from './Blue2.png';

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
    id: string;
    content: string;
    dateSent: string; 
    sender: string;
}

export const Motivation = (props: any) => {

    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const fetchMessages = async () => {
            const data: Message[] = [
                {
                    id: "1",
                    content:
                        "Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.Decide stand identify watch speak candidate institution. Radio ok indicate. Economy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.",
                    dateSent: "1997-12-23",
                    sender: "Jonathan Osborne",
                },
                {
                    id: "2",
                    content:
                        "Field set marriage detail. Example Mr crime wear war concern above yourself. That better two behind establish popular probably.",
                    dateSent: "2017-10-18",
                    sender: "Katherine Smith",
                },
                {
                    id: "3",
                    content:
                        "Notice state meet really. Might over article may now choose. Late beautiful picture available.",
                    dateSent: "1999-06-26",
                    sender: "Tammy Rodriguez",
                },
                {
                    id: "4",
                    content:
                        "Expert campaign sure difficult miss effort. Effect culture red reality.",
                    dateSent: "2007-09-29",
                    sender: "Ashley Mccarthy",
                },
                {
                    id: "5",
                    content:
                        "Author either draw agree enter sure include baby. Seem itself office one popular dinner.",
                    dateSent: "1972-09-17",
                    sender: "Jill Alvarez",
                },
                {
                    id: "6",
                    content: "Suffer most window spend.",
                    dateSent: "2014-06-18",
                    sender: "Christopher Andrade",
                },
                {
                    id: "7",
                    content:
                        "Nor like it turn evidence color clearly simple. Teacher consider miss state personal.",
                    dateSent: "1970-02-22",
                    sender: "Shawn Alexander",
                },
                {
                    id: "8",
                    content: "Close court perform well small participant.",
                    dateSent: "1977-05-05",
                    sender: "Barbara Harper",
                },
                {
                    id: "9",
                    content:
                        "Deal record much woman. Else statement defense situation standard south off.\nPass character message long. Other next away.",
                    dateSent: "2009-12-24",
                    sender: "Heather Jones",
                },
                //mock messages here
            ];
            setMessages(data);
        };

        fetchMessages();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'row', height: '100vh', overflow: 'hidden' }}>
                <Grid container spacing={3} sx={{ padding: 5, pt: 4, pb: 4 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ ml: 1 }}>
                            Your Wall
                        </Typography>
                        <Box sx={{ height: 'calc(100vh - 64px)', overflow: 'auto' }}>
                            <Grid container spacing={0}>
                                {messages.map((message, index) => (
                                    <Grid item sm={12} md={6} lg={4} key={index}>
                                        <Box sx={{
                                            position: "relative",
                                            padding: "5px",
                                            overflow: 'hidden', 
                                        }}>
                                            <ImageWithTextOverlay imageUrl={Blue2} text={message?.content} />
                                        </Box>
                                    </Grid>
                                ))}
                            </Grid>
                        </Box>
                    </Grid>
                </Grid>
            </div>
        </ThemeProvider >
    );
};

