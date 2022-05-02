import React, { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { useAuthState } from "react-firebase-hooks/auth";

import { 
    signInWithGoogle, 
    createComponentWithAuth, 
    auth,
    logout }
from './firebase';

function Login() {
  const [user, loading] = useAuthState(auth);
  const navigate = useNavigate();

  useEffect(() => {
    if (loading) {
        return;
    }
    if (user) {
        navigate("/dashboard");
    } 
  }, [user, loading]);

  return (
    <div className="App">
    <header className="App-header">
      <Fragment>
      <Box className="App-header" flexDirection="column" display="flex" >
        { user ? 
          <p>Olá, {user.displayName}!</p>:
          <p>Please sign in.</p>
        }
        { user
          ? <Button onClick={logout} variant="contained">Sign out</Button>
          : <Button onClick={signInWithGoogle} variant="contained">Sign in with Google</Button>
        }
        {
          loading && <h2>Loading..</h2>
        }
      </Box>
      </Fragment>
    </header>
    </div>
  );
}

export default createComponentWithAuth(Login);