import React, { useEffect, Fragment } from 'react';
import { useNavigate } from "react-router-dom";
import './App.css';
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';

import { getAuth } from "firebase/auth";
import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import withFirebaseAuth from 'react-with-firebase-auth'
import { useAuthState } from "react-firebase-hooks/auth";
import { signOut } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCoxYKn-P7YgEUPdcoaQzvK4C-pHIdVd2U",
  authDomain: "apt-footing-95820.firebaseapp.com",
  databaseURL: "https://apt-footing-95820-default-rtdb.firebaseio.com",
  projectId: "apt-footing-95820",
  storageBucket: "apt-footing-95820.appspot.com",
  messagingSenderId: "1049264655938",
  appId: "1:1049264655938:web:125d52737184a098ede7db",
  measurementId: "G-MVZRCLSRWD"
};

const firebaseApp = firebase.initializeApp(firebaseConfig);
const firebaseAppAuth = getAuth(firebaseApp);
const auth = firebase.auth();
const provider = new firebase.auth.GoogleAuthProvider();
const signInWithGoogle = () => auth.signInWithPopup(provider);

const createComponentWithAuth = withFirebaseAuth({
  provider,
  firebaseAppAuth,
});

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

  const logout = () => {
    signOut(auth);
  };

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