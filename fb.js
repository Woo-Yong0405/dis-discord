import firebase from "firebase";
import "firebase/auth";
import "firebase/firestore"

const firebaseConfig = {
    apiKey: "AIzaSyAXEdqlxYJu3-WYjjjwljnyLnVtnFKX0Gk",
    authDomain: "chatapp-91c45.firebaseapp.com",
    projectId: "chatapp-91c45",
    storageBucket: "chatapp-91c45.appspot.com",
    messagingSenderId: "652589945482",
    appId: "1:652589945482:web:72e917884e628271a81373",
    measurementId: "G-XJMV3T6FW5"
};

if (!firebase.apps.length) {
    firebase.initializeApp(firebaseConfig);
} else {
    firebase.app();
}

export const firebaseInstance = firebase;
export const authService = firebase.auth();
export const dbService = firebase.firestore();