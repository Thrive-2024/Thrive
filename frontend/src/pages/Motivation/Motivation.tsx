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
    variant: number;
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
                    variant: 5
                },
                {
                    id: "2",
                    content:
                        "Field set marriage detail. Example Mr crime wear war concern above yourself. That better two behind establish popular probably.",
                    dateSent: "2017-10-18",
                    sender: "Katherine Smith",
                    variant: 4
                },
                {
                    id: "3",
                    content:
                        "Notice state meet really. Might over article may now choose. Late beautiful picture available.",
                    dateSent: "1999-06-26",
                    sender: "Tammy Rodriguez",
                    variant: 3
                },
                {
                    id: "4",
                    content:
                        "Expert campaign sure difficult miss effort. Effect culture red reality.",
                    dateSent: "2007-09-29",
                    sender: "Ashley Mccarthy",
                    variant: 2
                },
                {
                    id: "5",
                    content:
                        "Author either draw agree enter sure include baby. Seem itself office one popular dinner.",
                    dateSent: "1972-09-17",
                    sender: "Jill Alvarez",
                    variant: 1
                },
                {
                    id: "6",
                    content: "Suffer most window spend.",
                    dateSent: "2014-06-18",
                    sender: "Christopher Andrade",
                    variant: 5
                },
                {
                    id: "7",
                    content:
                        "Nor like it turn evidence color clearly simple. Teacher consider miss state personal.",
                    dateSent: "1970-02-22",
                    sender: "Shawn Alexander",
                    variant: 2
                },
                {
                    id: "8",
                    content: "Close court perform well small participant.",
                    dateSent: "1977-05-05",
                    sender: "Barbara Harper",
                    variant: 3
                },
                {
                    id: "9",
                    content:
                        "Deal record much woman. Else statement defense situation standard south off.\nPass character message long. Other next away.",
                    dateSent: "2009-12-24",
                    sender: "Heather Jones",
                    variant: 4
                },
                //mock messages here
            ];
            setMessages(data);
        };

        fetchMessages();
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <div style={{ display: 'flex', flexDirection: 'row', maxHeight: '100vh' }}>
                <Grid container spacing={3} sx={{ py: 2, px: 5 }}>
                    <Grid item xs={12}>
                        <Typography variant="h5" sx={{ ml: 1, mb: 1.5 }}>
                            Your Wall
                        </Typography>
                        <Box sx={{
                            height: '60%', overflow: 'auto', background: '#F7F7F7', borderRadius: '10px',

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
                                        <Box sx={{
                                            position: "relative",
                                            padding: "5px",
                                            overflow: 'hidden',
                                        }}>
                                            <ImageWithTextOverlay variant={message?.variant} text={message?.content} />
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

