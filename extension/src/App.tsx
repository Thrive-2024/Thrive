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
          <AssignmentOutlinedIcon />
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          <AccessTimeOutlinedIcon />
        </Tab>
        <Tab disableIndicator variant="soft" sx={{ flexGrow: 1 }}>
          <ReportProblemOutlinedIcon />
        </Tab>
      </TabList>

      <TabPanel value={0}>
        <Typography level="inherit">
          Assignment
        </Typography>
      </TabPanel>

      <TabPanel value={1}>
        <Typography level="inherit">
          Pomodoro Timer
        </Typography>
      </TabPanel>

      <TabPanel value={2}>
        <Typography level="inherit">
          Restricted Sites
        </Typography>
      </TabPanel>

    </Tabs>
  );
}

export default App;
