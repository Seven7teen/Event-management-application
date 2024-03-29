import {firebase} from "@firebase/app";
import "@firebase/auth";
import "@firebase/database";
import "@firebase/firestore";
import "@firebase/messaging"
import "@firebase/storage";

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
// const firebaseConfig = {
//   apiKey: "AIzaSyC2Wm1jCLHsVGeu0a0IAM_aPfclkP5BbP4",
//   authDomain: "calwin-smartcalendar.firebaseapp.com",
//   databaseURL: "https://calwin-smartcalendar-default-rtdb.firebaseio.com",
//   projectId: "calwin-smartcalendar",
//   storageBucket: "calwin-smartcalendar.appspot.com",
//   messagingSenderId: "886637231721",
//   appId: "1:886637231721:web:8bbf8af75ff3b359292cf8",
//   measurementId: "G-7HB9HTS4RC"
// };

const firebaseConfig = {
  apiKey: "AIzaSyA9VzeGnBpqinSnmWgzP54iqQsGR2AeF0Y",
  authDomain: "event-management-a025c.firebaseapp.com",
  projectId: "event-management-a025c",
  storageBucket: "event-management-a025c.appspot.com",
  messagingSenderId: "812049349901",
  appId: "1:812049349901:web:f6d0a8af1b03ec2dc9c444",
  measurementId: "G-VQMNWL8KBB"
};



firebase.initializeApp(firebaseConfig);


const auth = firebase.auth();
// var database = firebase.database();

export { auth, firebase as default};