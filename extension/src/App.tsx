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
import { Container } from '@mui/joy';
import './pomodoro/styles/globals.css'
import Pomodoro from './pomodoro/popup/Pomodoro';
import Assignment from './assignment/Assignment';
import SiteBlocker from './siteBlocker/SiteBlocker';

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
          height: 400,
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
          <Assignment />
        </TabPanel>

        {/* Pomodoro Timer Tab */}
        <TabPanel value={1}>
          <Pomodoro />
        </TabPanel>

        {/* Site Restriction Tab */}
        <TabPanel value={2}>
          <Typography level="inherit">
            <SiteBlocker />
          </Typography>
        </TabPanel>

      </Tabs>
  );
}

export default App;

