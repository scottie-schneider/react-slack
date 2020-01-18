import firebase from 'firebase/app';
import "firebase/auth";
import "firebase/firestore";
import "firebase/storage";

var firebaseConfig = {
  apiKey: "AIzaSyBlSUbiXXwHMXvcgfecbmlwXql8-PzaO_U",
  authDomain: "react-slack-clone-44e75.firebaseapp.com",
  databaseURL: "https://react-slack-clone-44e75.firebaseio.com",
  projectId: "react-slack-clone-44e75",
  storageBucket: "react-slack-clone-44e75.appspot.com",
  messagingSenderId: "113338155854",
  appId: "1:113338155854:web:40c4433b35caeab3cc941f"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export default firebase;