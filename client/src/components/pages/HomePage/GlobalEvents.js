import React, {useState, useEffect} from 'react';
import firebase from '../../../firbase'
import { Link,useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';


const db = firebase.firestore();

function GlobalEvents() {
    const [globalEventsData, setGlobalEventsData] = useState([]);
    const {currentUser} = useAuth();
    const myState = { currentUserId: currentUser.uid }; 

    useEffect(() => {
            db.collection("globalEvents").get().then((querySnapshot) => {
                const tempDoc = [];
                querySnapshot.forEach((doc) => {
                    tempDoc.push({ id: doc.id, ...doc.data() })
                 })
                setGlobalEventsData(tempDoc);
                console.log(tempDoc);
            })
    },[])

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






//             <div>
//                 <h1>{item.globalEventName}</h1>
//                 <h2>{item.startDate}</h2>
//                 <h2>{item.endDate}</h2>
//                 <Link to={{
//         pathname: `/globalEventService/${item.globalEventId}`,
//         state: myState
//       }}
// >
//                     <button type="button" className="btn btn-light btn-sm">Join Event</button>
//                 </Link>
//             </div>
        ))
        }
      
    </>
  );
}

export default GlobalEvents;
