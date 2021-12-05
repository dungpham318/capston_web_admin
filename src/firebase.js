// Import the functions you need from the SDKs you need
import firebase from 'firebase/compat/app'
import 'firebase/compat/messaging';
const messaging = firebase.messaging()

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

export const getToken = (setTokenFound) => {
  return messaging.getToken({ vapidKey: 'GENERATED_MESSAGING_KEY' }).then((currentToken) => {
    if (currentToken) {
      console.log('current token for client: ', currentToken);
      setTokenFound(true);
      // Track the token -> client mapping, by sending to backend server
      // show on the UI that permission is secured
    } else {
      console.log('No registration token available. Request permission to generate one.');
      setTokenFound(false);
      // shows on the UI that permission is required 
    }
  }).catch((err) => {
    console.log('An error occurred while retrieving token. ', err);
    // catch error while creating client token
  });
}
