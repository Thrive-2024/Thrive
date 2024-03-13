import React, { useEffect, useState, useRef } from "react";
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
import SendIcon from "@mui/icons-material/Send";
import { red, blue, green, amber, deepPurple } from "@mui/material/colors";

interface Message {
  id: number;
  content: string;
  dateSent: string; // Assuming dateSent is a string, you might need to format it
  sender: string;
  senderName: string;
  x: number;
  y: number;
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
              {message.senderName}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export const Wall = (props: any) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [selectedMessage, setSelectedMessage] = useState<Message | null>(null);
  const [msgBoardOpen, setMsgBoardOpen] = useState(false);
  const [msgBoardRecipient, setMsgBoardRecipient] = useState("");
  const [msgBoardMessage, setMsgBoardMessage] = useState("");

  const handleMsgBoardClickOpen = () => {
    setMsgBoardOpen(true);
  };

  const handleMsgBoardClose = () => {
    setMsgBoardOpen(false);
  };

  // Function to chunk messages array into a 2D array for columns
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

  const columns = chunkMessages(messages, 3); // Create 3 columns

  const handleMsgBoardSend = () => {
    // Implement the send logic here
    console.log(
      "Sending message to:",
      msgBoardRecipient,
      "Message:",
      msgBoardMessage
    );
    setMsgBoardOpen(false);
    // Reset form fields
    setMsgBoardRecipient("");
    setMsgBoardMessage("");
  };

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
            senderName: msg.senderName === "SYSTEM" ? "Dive" : msg.senderName, // Replace 'SYSTEM' with 'DIVE'
            x: Math.random() * 100,
            y: Math.random() * 100, // left the x y as random bc data is all 0s, just change to msg.x/y
          })
        );
        setMessages(mappedMessages);
        console.log(mappedMessages);
      } catch (error) {
        console.error("Failed to fetch messages:", error);
      }
    };

    fetchMessages();
  }, []);

  const handleSendClick = () => {
    // Implement the logic to send a message or open a dialog/form for sending messages
    console.log("Send to button clicked");
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
          <Grid container spacing={4}>
            {columns.map((colMessages, colIndex) => (
              <Grid item marginBottom={2} xs={4} key={colIndex}>
                {" "}
                {/* xs={4} for 3 columns */}
                <Stack spacing={2}>
                  {" "}
                  {/* Stack with spacing for vertical spacing */}
                  {colMessages.map((message) => (
                    <MessageCard
                      message={message}
                      onClick={() => handleCardClick(message)}
                    />
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
          <Box sx={{ position: "absolute", bottom: 14, right: 14 }}>
            {" "}
            {/* Position the button at the bottom right */}
            <Tooltip
              title="Send a message!"
              placement="left"
              componentsProps={{
                tooltip: {
                  sx: {
                    fontSize: "1.25rem", // Larger text
                    backgroundColor: "rgba(255, 255, 255, 0.3)", // Semi-transparent background
                    padding: "10px", // Larger padding
                  },
                },
              }}
            >
              <Fab
                color="primary"
                aria-label="send"
                onClick={handleMsgBoardClickOpen}
              >
                <SendIcon />
              </Fab>
            </Tooltip>
          <Dialog
            open={selectedMessage != null}
            onClose={handleCloseDialog}
            aria-labelledby="message-dialog"
            maxWidth="sm"
            fullWidth
          >
            <DialogContent>
              {selectedMessage && (
                <>
                  <Typography
                    variant="h5"
                    component="p"
                    gutterBottom
                    style={{ wordBreak: "break-word", marginBottom: "16px" }}
                  >
                    {selectedMessage.content}
                  </Typography>
                  <Box display="flex" justifyContent="space-between">
                    <Typography variant="caption">
                      {selectedMessage.dateSent}
                    </Typography>
                    <Typography variant="caption">
                      {selectedMessage.senderName}
                    </Typography>
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
