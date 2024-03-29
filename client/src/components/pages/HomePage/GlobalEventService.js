import React, { useEffect, useState } from 'react';
import {useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Sidebar from "./EventServices/Sidebar";
import EventNavigation from './EventServices/EventNavigation';
import firebase from '../../../firbase';
import { useAuth } from '../../Auth/AuthContext';
import "../../HeroSection.css";


const db = firebase.firestore();


function GlobalEventService() {
  const { globalEventId } = useParams();
  const {currentUser} = useAuth();
  const location = useLocation();
  const [userType, setUserType] = useState('Attendee');
  const myState = location.state;

  useEffect(async () => {
    await db.collection('users').doc(myState.currentUserId).update({
      globalEvents: firebase.firestore.FieldValue.arrayUnion(globalEventId)
    });
    if(currentUser.email.toString() === "iit2019009@iiita.ac.in") {
      // type = 'Admin';
      setUserType('Admin');
    }
  },[]);
  
  useEffect(async () => {
    // let type = 'Attendee';
      await db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
          if(doc.exists){
            doc.data().speakers.forEach((item) => {
              if(item.speakerEmail === currentUser.email) {
                  // type = 'Speaker';
                  setUserType('Speaker');
              } 
            });  
          }
      });
  },[]);

  return (
    <div className="app">
      <div className='darkBg'>
        <EventNavigation globalEventId={globalEventId} userType={userType}/>
        {/* <h1 className="navigation">Navigation</h1> */}
        <Sidebar globalEventId={globalEventId} userType={userType} />
        </div>
    </div>
);


}

export default GlobalEventService;
