import firebase from "firebase/app";
import "firebase/messaging";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyAQmr9ELsidHbD6LEl-DyfjxP5fRj2GvSE",
  authDomain: "capstone-96c55.firebaseapp.com",
  projectId: "capstone-96c55",
  storageBucket: "capstone-96c55.appspot.com",
  messagingSenderId: "1047493414521",
  appId: "1:1047493414521:web:05de095c28a764b054cea8",
  measurementId: "G-CKF4NKQXFB"
};

firebase.initializeApp(firebaseConfig);

const messaging = firebase.messaging();

const { REACT_APP_VAPID_KEY } = process.env;
const publicKey = REACT_APP_VAPID_KEY;

export const getToken = async (setTokenFound) => {
  let currentToken = "";

  try {
    currentToken = await messaging.getToken({ vapidKey: publicKey });
    if (currentToken) {
      setTokenFound(true);
    } else {
      setTokenFound(false);
    }
  } catch (error) {
    console.log("An error occurred while retrieving token. ", error);
  }

  return currentToken;
};

export const onMessageListener = () =>
  new Promise((resolve) => {
    messaging.onMessage((payload) => {
      resolve(payload);
    });
  });
