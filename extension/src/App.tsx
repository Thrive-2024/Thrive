import './App.css';
import * as React from 'react';
import Box from '@mui/material/Box';
import Tabs from '@mui/joy/Tabs';
import TabList from '@mui/joy/TabList';
import Tab, { tabClasses } from '@mui/joy/Tab';
import TabPanel from '@mui/joy/TabPanel';
import Typography from '@mui/joy/Typography';
import AssignmentOutlinedIcon from '@mui/icons-material/AssignmentOutlined';
import AccessTimeOutlinedIcon from '@mui/icons-material/AccessTimeOutlined';
import ReportProblemOutlinedIcon from '@mui/icons-material/ReportProblemOutlined';
import MoreVertIcon from '@mui/icons-material/MoreVert';
import { Container } from '@mui/joy';
import Pomodoro from './pomodoro/popup/Pomodoro'

function App() {

  const [value, setValue] = React.useState('1');
  const handleChange = (event: React.SyntheticEvent, newValue: string) => {
    setValue(newValue);
  };


  return (
    <Tabs
      variant="outlined"
      aria-label="Pricing plan"
      defaultValue={0}
      orientation="vertical"
      sx={{
        width: 343,
        borderRadius: 'lg',
        boxShadow: 'sm',
        overflow: 'auto',
        flexDirection: 'row-reverse'
      }}
    >
      <TabList
        disableUnderline
        tabFlex={1}
        sx={{
          [`& .${tabClasses.root}`]: {
            fontSize: 'sm',
            fontWeight: 'lg',
            [`&[aria-selected="true"]`]: {
              color: 'primary.500',
              bgcolor: 'background.surface',
            },
            [`&.${tabClasses.focusVisible}`]: {
              outlineOffset: '-4px',
            },
          },
        }}
      >
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          <AssignmentOutlinedIcon sx={{ color:'#99C2F0' }} />
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          <AccessTimeOutlinedIcon sx={{ color:'#99C2F0' }} />
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          <ReportProblemOutlinedIcon sx={{ color:'#99C2F0' }} />
        </Tab>
      </TabList>

      {/* Assignment Tab */}
      <TabPanel value={0}>
        <Container sx={{ display:'flex' }}>
          <Typography sx={{ color:"#A3A3A3", marginRight:'10%', fontSize:'14px' }} >
              Currently working on
          </Typography>
          <MoreVertIcon sx={{ fontSize:'20px', marginLeft:'10%' }} />
        </Container>
        <Typography level="inherit">
          Assignment 2
        </Typography>
        <Container sx={{ display:'flex' }} >
          <Typography sx={{ background:'#CCCCFF', borderRadius:'20px', p:0.5 }} >
            Linear Algebra
          </Typography>
          <Typography>
            2 days left
          </Typography>
        </Container>
      </TabPanel>

      {/* Pomodoro Timer Tab */}
      <TabPanel value={1}>
        <Typography level="inherit">
          Pomodoro Timer
        </Typography>
        <Pomodoro />
      </TabPanel>

      {/* Site Restriction Tab */}
      <TabPanel value={2}>
        <Typography level="inherit">
          Restricted Sites
        </Typography>
      </TabPanel>

    </Tabs>
  );
}

export default App;

