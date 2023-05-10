import React, {useState, useEffect} from 'react';
import firebase from '../../../firbase'
import { Link,useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import AddGlobalEvent from './EventServices/AddGlobalEvent';


const db = firebase.firestore();

function GlobalEvents() {
    const [globalEventsData, setGlobalEventsData] = useState([]);
    const {currentUser} = useAuth();
    const myState = { currentUserId: currentUser.uid }; 
    const [userType, setUserType] = useState('User');
    const [open,setOpen] = useState(false);
    const [scroll, setScroll] = React.useState('paper');

    function handleAddEvent(scrollType){
        setOpen(true);
        setScroll(scrollType);
    }

    useEffect(() => {
            if(currentUser.email.toString() === "iit2019009@iiita.ac.in") {
              setUserType('Admin');
            }
            db.collection("globalEvents").get().then((querySnapshot) => {
                const tempDoc = [];
                querySnapshot.forEach((doc) => {
                    tempDoc.push({ id: doc.id, ...doc.data() })
                 })
                setGlobalEventsData(tempDoc);
                console.log(tempDoc);
            })
    },[open]);

    


  return (
    <>
      {/* <EventCreationForm /> */}
      <div>
        <h1>Global Events</h1>
      </div>
      {globalEventsData.map((item, index) => (

        <div className='session-event'>
        <div className="session-day" key={index}>
        <div className="session-events">
          <div className="session-event">
            <h4>{item.globalEventName ? item.globalEventName : 'null'}</h4>
            <p>{item.startDate ? item.startDate : 'null'} - {item.endDate ? item.endDate : 'null'}</p>
          </div>
          <div className="session-buttons">

          <Link to={{
              pathname: `/globalEventService/${item.globalEventId}`,
              state: myState
            }}
      >
              <button type="button" className="btn btn-light btn-sm">Join Event</button>
          </Link>
          </div>
        </div>
        </div>
        </div>
        ))
        }

        {userType === 'Admin' && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddEvent('paper')}>Add Event</button>
        )} 

        <AddGlobalEvent open={open} setOpen={setOpen} scroll={scroll} setScroll={setScroll}/>
      
    </>
  );
}

export default GlobalEvents;
