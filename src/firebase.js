import { getAuth, signOut } from "firebase/auth";

import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

import withFirebaseAuth from 'react-with-firebase-auth'

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
const provider = new firebase.auth.GoogleAuthProvider();
const firebaseAppAuth = getAuth(firebaseApp);

export const auth = firebase.auth();
export const signInWithGoogle = () => auth.signInWithPopup(provider);

export const createComponentWithAuth = withFirebaseAuth({
    provider,
    firebaseAppAuth,
});

export const logout = () => {
    signOut(auth);
};