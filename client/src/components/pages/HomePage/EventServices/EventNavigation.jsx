import React, { useEffect, useState } from "react";
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import { Link } from 'react-router-dom';



const db = firebase.firestore();

const EventNavigation = (props) => {

    const {currentUser} = useAuth();
    // const [currentUserName, setCurrentUserName] = useState();

    const [globalEvent, setGlobalEvent] = useState({
        globalEventName: "Event",
        startDate: "",
        endDate: ""
    });



    useEffect(async () => {
        await db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setGlobalEvent({
                    globalEventName: doc.data().globalEventName,
                    startDate: doc.data().startDate,
                    endDate: doc.data().endDate
                })          
            } else {
                console.log("error");
            }
        });
    },[]);



    return (
        <div className="navigateGlobalEvent">
            <div className="eventLeftNav">
            <span className="eventName navItem">{globalEvent.globalEventName}</span>
            <span className="navItem">{globalEvent.startDate}</span>
            <span className="navItem">--</span>
            <span className="navItem">{globalEvent.endDate}</span>
            </div>
            <div className="eventRightNav">
                <span className="navItem">{props.userType}</span>  
            <span className="userNameNav navItem">{currentUser.displayName}</span>
            <Link to='/' className='btn-link'>
                <span className="navItem">Home</span>
            {/* <button type="button" className="btn btn-light btn-sm">Home</button> */}
                  </Link>
            </div>
        </div>
    )

}

export default EventNavigation;