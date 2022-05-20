import React, { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import { useAuthState } from "react-firebase-hooks/auth";
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { auth, logout } from './firebase';
import firebase from 'firebase/compat/app';

const db = firebase.firestore();

function Dashboard() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
      return;
    }
    if (!user) {
      navigate("/");
    } 
  }, [user, loading]);

  return (
    <div className="App">
    <header className="App-header">
      <Fragment>
      <Box className="App-header" flexDirection="column" display="flex" >
        Logged in as {user?.displayName}
        <Button onClick={logout} variant="contained">Sign out</Button>
      </Box>
      </Fragment>
    </header>
    </div>
  );
}
export default Dashboard;