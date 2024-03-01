import React, { useEffect, useState } from "react";
import { Navbar, RightNavbar, MidTopSection } from "../../Navbar";
import {
  Box,
  Divider,
  Grid,
  Typography,
  Card,
  CardContent,
  Stack,
} from "@mui/material";
import { red, blue, green, amber, deepPurple } from '@mui/material/colors';



interface Message {
  id: string;
  content: string;
}

const backgroundColors = [red[100], blue[100], green[100], amber[100], deepPurple[100]];


const MessageCard: React.FC<{ message: Message }> = ({ message }) => {

  const backgroundColor = backgroundColors[Math.floor(Math.random() * backgroundColors.length)];

  return(
  <Card sx={{ backgroundColor }}>
    <CardContent>
      <Typography
        variant="body1"
        style={{ wordBreak: "break-word", maxWidth: "280px" }}
      >
        {message.content}
      </Typography>
    </CardContent>
  </Card>
);
  }


export const Wall = () => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {

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
          content: "grthgyjhkjytredfgvgbnmhgjtyrewdfgvhjytresdfghjytredf",
        },
        { id: "2", content: "Message 2" },
        {
          id: "3",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti sed, dolorum ipsam maiores repellat repellendus doloremque consectetur mollitia voluptates soluta! Dolorum reprehenderit, sequi eaque illo cumque aliquid sit voluptas at.        ",
        },
        { id: "4", content: "Message 4" },
        {
          id: "5",
          content: "grthgyjhkjytredfgvgbnmhgjtyrewdfgvhjfghjhgfvdcrftgtyhjhnhbvcfddretyujnbfrtyujnbgytresdfghjytredf",
        },
        { id: "6", content: "Message 2" },
        {
          id: "7",
          content:
            "Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti sed, dolorum ipsam maiores repellat repellendus doloremque consectetur mollitia voluptates soluta! Dolorum reprehenderit, sequi eaque illo cumque aliquid sit voluptas at.        ",
        },
        { id: "8", content: "Message 4" },
        
        //mock messages here
      ];
      setMessages(data);
    };

    fetchMessages();
  }, []);

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
                {/* xs={4} for 3 columns */}
                <Stack spacing={2}>
                  {" "}
                  {/* Stack with spacing for vertical spacing */}
                  {colMessages.map((message) => (
                    <MessageCard key={message.id} message={message} />
                  ))}
                </Stack>
              </Grid>
            ))}
          </Grid>
        </Box>
      </Grid>
    </div>
  );
};
