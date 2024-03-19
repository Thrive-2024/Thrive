import React, { useEffect, useState } from "react";
import { Navbar, RightNavbar, MidTopSection } from "../../Navbar";
import { Box, Divider, Grid, Typography, DialogContent, DialogTitle, Dialog, DialogActions, Button, DialogContentText, InputLabel, Select, MenuItem, DialogProps } from "@mui/material";
import { Dashboard } from "../Home";
// import { Wall } from "../Wall";
import { Motivation } from "../Motivation";
import { Leaderboard } from "../Leaderboard";

export const App = () => {
  const [allUsers, setAllUsers] = useState<any[]>([])

  const [selectedUser, setSelectedUser] = useState("james@gmail.com")
  const [currentUsername, setCurrentUsername] = useState("James")
  const [currentUser, setCurrentUser] = useState("james@gmail.com");
  const [navValue, setNavValue] = useState('Dashboard');

  const handleSelectedUserChange = (event: any) => {
    setSelectedUser(event.target.value);
  };

  const handleNavValueChange = (value: string) => {
    setNavValue(value);
  };

  //for "login"
  const [open, setOpen] = React.useState(false);

  const handleProfileClick = () => {
    setOpen(true);
  };

  const handleClose = (event:any) => {
    // if (reason && reason === "backdropClick")
    //   return;
    setSelectedUser(currentUser);
    setOpen(false);
  }

  const handleLogin = (event: any) => {
    event.preventDefault();
    if (selectedUser != '') {
      setOpen(false);
      setCurrentUser(selectedUser);
      setCurrentUsername(getNameByEmail(selectedUser));
    } else {
      alert("No user selected")
    }
  }

  const fetchAllUsers = async () => {
    console.log("user fetcher called");

    try {
      const response = await fetch(`${process.env.REACT_APP_BACKEND_PRODUCTION_URL}/miscellaneous/getAllUser`, {
        headers: {
          'Content-Type': 'application/json'
        },
        method: 'GET'
      });

      if (response.status != 200) {
        console.log("ERROR FETCHING USERS");

      } else {
        const apiResponse = await response.json();
        console.log(apiResponse);
        setAllUsers(apiResponse.data)
      }

    } catch (err) {
      window.alert(err);
      return null;
    }

  }

  const getNameByEmail = (email:string) =>{
    const user = allUsers.find(user => user.email === email);
    return user ? user.name : null;
  }

  useEffect(() => {
    fetchAllUsers();
  }, [])
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
      }}
    >
      <Grid container>
        <Grid item xs={2}>
          <Navbar onNavValueChange={handleNavValueChange} currentUser = {currentUser} currentUsername ={currentUsername} onProfileClick={handleProfileClick}/>
        </Grid>

        <Grid item xs={8}>
          <Box>
            <MidTopSection />
            <Divider />
          </Box>
          {currentUser !== '' ? (
            // Conditionally render components based on navValue
            <>
              {navValue === 'Dashboard' && <Dashboard currentUser = {currentUser} />}
              {navValue === 'Wall' && <Motivation currentUser = {currentUser}/>}
              {navValue === 'Leaderboard' && <Leaderboard currentUser = {currentUser}/>}
            </>
          ) : (
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                height: "100vh",
                overflow: "hidden",
              }}
            >
              <Grid container spacing={0} sx={{ padding: 5, pt: 4, backgroundColor:'blue' }}>
                <Grid item xs={12}>
                  <Typography variant="h1" sx={{ textAlign: 'center', height: '100vh', pt: '30%' }}>
                    User Not Found
                  </Typography>
                </Grid>{" "}</Grid></div>
          )}
        </Grid>

        <Grid item xs={2}>
          <RightNavbar currentUser = {currentUser}/>
        </Grid>
      </Grid>

      <Dialog
        open={open}
        onClose={handleClose}
      >
        <DialogContent sx={{ width: 300 }}>
          <InputLabel id="demo-simple-select-label">User</InputLabel>
          <Select
            labelId="demo-simple-select-label"
            id="demo-simple-select"
            value={selectedUser}
            label="User"
            onChange={handleSelectedUserChange}
            // defaultChecked={allUsers.length>0 ?allUsers[0].name:'none'}
            defaultValue="User"
            sx={{ width: '100%' }}
          >
            {allUsers.length > 0 && allUsers.map((user) =>
              <MenuItem value={user.email}>{user.name}</MenuItem>
            )}

          </Select>
        </DialogContent>
        <DialogActions>
          {/* <Button onClick={handleClose}>Cancel</Button> */}
          <Button onClick={handleLogin}>Login</Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}