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



    useEffect(() => {
        db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setGlobalEvent({
                    globalEventName: doc.data().globalEventName,
                    startDate: doc.data().startDate,
                    endDate: doc.data().endDate
                })          
            }
        });
    },[]);

    // useEffect(() => {
    //     db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
    //         if(doc.exists){
                     
    //         }
    //     });
    // },[])



    return (
        <div className="navigateGlobalEvent">
            <div>
            <span className="eventName">{globalEvent.globalEventName}</span>
            <span>{globalEvent.startDate}</span>
            <span>--</span>
            <span>{globalEvent.endDate}</span>
            </div>
            <div className="eventRightNav">
            <p>{currentUser.displayName}</p>
            <Link to='/' className='btn-link'>
                <p>Home</p>
            {/* <button type="button" className="btn btn-light btn-sm">Home</button> */}
                  </Link>
            </div>
        </div>
    )

}

export default EventNavigation;