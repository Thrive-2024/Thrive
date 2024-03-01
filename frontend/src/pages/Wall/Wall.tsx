import React, { useEffect, useState } from "react";
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
} from "@mui/material";
import SendIcon from '@mui/icons-material/Send';
import { red, blue, green, amber, deepPurple } from "@mui/material/colors";

interface Message {
  id: string;
  content: string;
  dateSent: string; // Assuming dateSent is a string, you might need to format it
  fromWho: string;
}

const backgroundColors = [
  red[100],
  blue[100],
  green[100],
  amber[100],
  deepPurple[100],
];

const MessageCard: React.FC<{ message: Message; onClick: () => void }> = ({
  message,
  onClick,
}) => {
  const backgroundColor =
    backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  return (
    <Card
      onClick={onClick}
      style={{ cursor: "pointer" }}
      sx={{ backgroundColor }}
    >
      <CardContent>
        <Box display="flex" flexDirection="column" height="100%">
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption" color="textSecondary">
              {message.dateSent}
            </Typography>
          </Box>
          <Typography
            variant="body1"
            style={{ wordBreak: "break-word", flexGrow: 1 }}
          >
            {message.content}
          </Typography>
          <Box display="flex" justifyContent="flex-end">
            <Typography variant="caption" color="textSecondary">
              {message.fromWho}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const Wall = (props:any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [msgBoardOpen, setMsgBoardOpen] = useState(false);
  const [msgBoardRecipient, setMsgBoardRecipient] = useState('');
  const [msgBoardMessage, setMsgBoardMessage] = useState('');

  const handleMsgBoardClickOpen = () => {
    setMsgBoardOpen(true);
  };

  const handleMsgBoardClose = () => {
    setMsgBoardOpen(false);
  };

  const handleMsgBoardSend = () => {
    // Implement the send logic here
    console.log('Sending message to:', msgBoardRecipient, 'Message:', msgBoardMessage);
    setMsgBoardOpen(false);
    // Reset form fields
    setMsgBoardRecipient('');
    setMsgBoardMessage('');
  };

  useEffect(() => {
    // CALL FROM DATABASE (IDK HOW)
    // Function to fetch data from your API
    //   const fetchMessages = async () => {
    //     try {
    //       const response = await fetch('YOUR_API_ENDPOINT');
    //       const data = await response.json();
    //       setMessages(data);
    //     } catch (error) {
    //       console.error('Failed to fetch messages:', error);
    //     }
    //   };

    //   fetchMessages();
    // }, []);
    // MOCK DATA VERSION -------------------------
    const fetchMessages = async () => {
      const data: Message[] = [
        {
          id: "1",
          content:
            "Decide stand identify watch speak candidate institution. Radio ok indicate.\nEconomy mother five floor. Benefit modern coach nearly amount. About amount try meet garden.",
          dateSent: "1997-12-23",
          fromWho: "Jonathan Osborne",
        },
        {
          id: "2",
          content:
            "Field set marriage detail. Example Mr crime wear war concern above yourself. That better two behind establish popular probably.",
          dateSent: "2017-10-18",
          fromWho: "Katherine Smith",
        },
        {
          id: "3",
          content:
            "Notice state meet really. Might over article may now choose. Late beautiful picture available.",
          dateSent: "1999-06-26",
          fromWho: "Tammy Rodriguez",
        },
        {
          id: "4",
          content:
            "Expert campaign sure difficult miss effort. Effect culture red reality.",
          dateSent: "2007-09-29",
          fromWho: "Ashley Mccarthy",
        },
        {
          id: "5",
          content:
            "Author either draw agree enter sure include baby. Seem itself office one popular dinner.",
          dateSent: "1972-09-17",
          fromWho: "Jill Alvarez",
        },
        {
          id: "6",
          content: "Suffer most window spend.",
          dateSent: "2014-06-18",
          fromWho: "Christopher Andrade",
        },
        {
          id: "7",
          content:
            "Nor like it turn evidence color clearly simple. Teacher consider miss state personal.",
          dateSent: "1970-02-22",
          fromWho: "Shawn Alexander",
        },
        {
          id: "8",
          content: "Close court perform well small participant.",
          dateSent: "1977-05-05",
          fromWho: "Barbara Harper",
        },
        {
          id: "9",
          content:
            "Deal record much woman. Else statement defense situation standard south off.\nPass character message long. Other next away.",
          dateSent: "2009-12-24",
          fromWho: "Heather Jones",
        },
        //mock messages here
      ];
      setMessages(data);
    };

    fetchMessages();
  }, []);

  const handleSendClick = () => {
    // Implement the logic to send a message or open a dialog/form for sending messages
    console.log('Send to button clicked');
  };

  const handleCardClick = (message: Message) => {
    setSelectedMessage(message);
  };

  const handleClose = () => {
    setSelectedMessage(null);
  };

  const handleCloseDialog = () => {
    setSelectedMessage(null);
  };  
  // Function to chunk messages array into a 2D array for 3 columns
  const chunkMessages = (
    messages: Message[],
    numOfColumns: number
  ): Message[][] => {
    const chunked = [];
    const chunkSize = Math.ceil(messages.length / numOfColumns);

    for (let i = 0; i < numOfColumns; i++) {
      chunked.push(messages.slice(i * chunkSize, (i + 1) * chunkSize));
    }

    return chunked;
  };

  const columns = chunkMessages(messages, 3);

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid container spacing={3} sx={{ padding: 5, pt: 4 }}>
        <Grid item xs={12}>
          <Typography variant="h5" sx={{ ml: 1 }}>
            Your Wall
          </Typography>
        </Grid>{" "}
        <Box
          minHeight={500}
          minWidth={1000}
          sx={{
            backgroundColor: "brown",
            borderRadius: 4,
            border: 15,
            borderColor: "burlywood",
          }} //WALL BASE
        >
          <Grid container spacing={2} padding={2}>
            {columns.map((colMessages, colIndex) => (
              <Grid item xs={4} key={colIndex}>
                {" "}
                <Stack spacing={2}>
                  {" "}
                  {colMessages.map((message) => (
                    <MessageCard
                      key={message.id}
                      message={message}
                      onClick={() => handleCardClick(message)}
                    />
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ position: 'absolute', bottom: 97, right: 320  }}> {/* Position the button at the bottom right */}
        <Fab color="primary" aria-label="send" onClick={handleMsgBoardClickOpen}>
          <SendIcon />
        </Fab>
      </Box>
      <Dialog open={selectedMessage != null} onClose={handleCloseDialog} aria-labelledby="message-dialog" maxWidth="sm" fullWidth>
        <DialogContent>
          {selectedMessage && (
            <>
              <Typography variant="h5" component="p" gutterBottom style={{ wordBreak: 'break-word', marginBottom: '16px' }}>
                {selectedMessage.content}
              </Typography>
              <Box display="flex" justifyContent="space-between">
                <Typography variant="caption">{selectedMessage.dateSent}</Typography>
                <Typography variant="caption">{selectedMessage.fromWho}</Typography>
              </Box>
            </>
          )}
        </DialogContent>
      </Dialog>
        </Box>
      </Grid>
      <Dialog open={msgBoardOpen} onClose={handleMsgBoardClose}>
        <DialogTitle>Send Message</DialogTitle>
        <DialogContent>
          <TextField
            autoFocus
            margin="dense"
            id="msgBoardRecipient"
            label="Recipient"
            type="text"
            fullWidth
            variant="standard"
            value={msgBoardRecipient}
            onChange={(e) => setMsgBoardRecipient(e.target.value)}
          />
          <TextField
            margin="dense"
            id="msgBoardMessage"
            label="Message"
            type="text"
            fullWidth
            variant="standard"
            multiline
            rows={4}
            value={msgBoardMessage}
            onChange={(e) => setMsgBoardMessage(e.target.value)}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleMsgBoardClose}>Cancel</Button>
          <Button onClick={handleMsgBoardSend}>Send</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
};
