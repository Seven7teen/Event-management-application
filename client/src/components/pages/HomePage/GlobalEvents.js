import React, {useState, useEffect} from 'react';
import firebase from '../../../firbase'
import { Link,useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/AuthContext';
import AddGlobalEvent from './EventServices/AddGlobalEvent';
import EditGlobalEvent from './EventServices/EditGlobalEvent';


const db = firebase.firestore();

function GlobalEvents() {
    const [globalEventsData, setGlobalEventsData] = useState([]);
    const {currentUser} = useAuth();
    const myState = { currentUserId: currentUser.uid }; 
    const [userType, setUserType] = useState('User');
    const [open,setOpen] = useState(false);

    // const [editOpen,setEditOpen] = useState(false);
    const [editOpenArr, setEditOpenArr] = useState([]);

    function handleAddEvent(){
        setOpen(true);
    }

    // function handleDeleteEvent(index, item) {
    //   const documentRef = db.collection("globalEvents").doc(item.globalEventId);
    //   documentRef.update({
    //     isDeleted: true
    //   })
    //     .then(() => {
    //       console.log('Document successfully deleted.');
    //     })
    //     .catch((error) => {
    //       console.error('Error removing document: ', error);
    //     });
    //   let updatedArr = [...editOpenArr];
    //   updatedArr.splice(index,1);
    //   setEditOpenArr(updatedArr);
    // }

    function handleEditEvent(index){

      let updatedArr = [...editOpenArr];
      updatedArr[index] = true;
      setEditOpenArr(updatedArr);
      console.log(updatedArr);
      
      // setEditOpenArr(prevItems => {
      //   const updatedItems = prevItems.map(item => {
      //     if (item.id === index) {
      //       // Create a new object with the updated name
      //       return { ...item, opener: true };
      //     }
      //     return item;
      //   });
      //   return updatedItems;
      // });
  }

    useEffect( () => {
            if(currentUser.email.toString() === "iit2019009@iiita.ac.in") {
              setUserType('Admin');
            }
             db.collection("globalEvents").onSnapshot((querySnapshot) => {
                const tempDoc = [];
                let localEditOpenArr = [];
                querySnapshot.forEach((doc) => {     
                      tempDoc.push({ id: doc.id, ...doc.data() });
                      localEditOpenArr.push(false);
                 });
                 const sortedArr = tempDoc.sort((a, b) => {
                  const dateA = new Date(a.startDate);
                  const dateB = new Date(b.startDate);
                
                  return dateA - dateB;
                });
                setGlobalEventsData(sortedArr);
                setEditOpenArr(localEditOpenArr);
                console.log(localEditOpenArr);
                
            })
    },[]);

    


  return (
    <>
      {/* <EventCreationForm /> */}
      <div>
        <h1>Global Events</h1>
        {/* <h1>sds editOpenArr[0]} sdsdd</h1> */}
        
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

          {userType === 'Admin' && (
              <button type="button" className="btn btn-light btn-sm" onClick={() => handleEditEvent(index)}>Edit</button>
             /* <button type="button" className="btn btn-light btn-sm" onClick={() => handleDeleteEvent(index, item)}>Delete</button> */
              )}

        <EditGlobalEvent open={editOpenArr} setOpen={setEditOpenArr} element={item} elementIndex={index}/>


          </div>
        </div>
        </div>
        </div>
        ))
        }

        {userType === 'Admin' && (
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => handleAddEvent()}>Add Event</button>
        )} 

        <AddGlobalEvent open={open} setOpen={setOpen} />
      
    </>
  );
}

export default GlobalEvents;
