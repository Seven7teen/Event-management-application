import React, { useEffect } from 'react';
import {useLocation } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import Sidebar from "./EventServices/Sidebar";
import EventNavigation from './EventServices/EventNavigation';
import firebase from '../../../firbase';


const db = firebase.firestore();


function GlobalEventService() {
  const { globalEventId } = useParams();
  const location = useLocation();
  const myState = location.state;

  useEffect(async () => {
    await db.collection('users').doc(myState.currentUserId).update({
      globalEvent: globalEventId
    });
  },[]);

  return (
    <div className="app">
        <EventNavigation globalEventId={globalEventId} />
        {/* <h1 className="navigation">Navigation</h1> */}
        <Sidebar globalEventId={globalEventId} />
        <h1>footer</h1>

    </div>
);


}

export default GlobalEventService;
