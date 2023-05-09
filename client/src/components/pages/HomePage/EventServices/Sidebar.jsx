import React, { useState, useEffect } from 'react';
import MainContent from "./MainContent";
import SessionsTab from './SessionsTab';
import Attendees from './Attendees';
import Speakers from './Speakers'
import Agenda from './Agenda';
import JitsiComponent from './JitsiComponent';
import ChatBox from './ChatBox';
import './styles.css';
import { useAuth } from '../../../Auth/AuthContext';
import firebase from '../../../../firbase';
import UpdateAttendeeProfile from './UpdateAttendeeProfile';
import UpdateSpeakerProfile from './UpdateSpeakerProfile';

const db = firebase.firestore();


const Sidebar = (props) => {
  const [activeItem, setActiveItem] = useState('Attendees');
  // const [click, setClick] = useState(false);
  const [dataFromChild, setDataFromChild] = useState(0);
  const [activeSession, setActiveSession] = useState({});
  const [clickedSession, setClickedSession] = useState('not clicked');
  const {currentUser} = useAuth();
  const [sessionListIndex, setSessionListIndex] = useState(5000);



  useEffect(async () => {
    const docref = db.collection('globalEvents').doc(props.globalEventId);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        const data =  doc.data().sessions;
        let newArrField = [...doc.data().sessions];
        console.log(newArrField);
        
        newArrField.map((item, index) => {
          if(item.sessionTitle === clickedSession) {
            const updatedObject = {...newArrField[index], activeParticipants: dataFromChild};
            newArrField[index] = updatedObject;

            docref.set({sessions: newArrField}, {merge: true})
            .then(() => {
              console.log('Document updated successfully');
            })
            .catch((error) => {
              console.error('Error updating document:', error);
            });
          }
        });
        // docref.update({
        //   'sessions.0.activeParticipants': dataFromChild
        // })
        //   .then(() => {
        //     console.log('Element added to the array successfully!');
        //   })
        //   .catch((error) => {
        //     console.error('Error updating array:', error);
        //   });
      } else {
        console.log("Doc not found");
      }
    })


    // await docref.update({
    //   activeParticipants: dataFromChild
    // })
    // .then(() => {
    //   console.log('Document updated successfully');
    // })
    // .catch((error) => {
    //   console.error('Error updating document:', error);
    // });
  },[dataFromChild])

  const handleChildData = (data) => {
    setDataFromChild(data);
  };

  const handleItemClick = (itemName) => {
    // if(itemName === 'Agenda') {
    //     setClick(!click);
    // }
    setActiveItem(itemName);
  };

  return (
    <div className="sidebar">
      <ul>
        {/* <li>
          {activeSession.sessionTitle}
        </li> */}
          {
            props.userType === 'Admin' && (
              <li className={activeItem === 'Agenda' ? 'active' : ''} onClick={() => handleItemClick('Agenda')}>
                Agenda
              </li>
            )
          }

        <li className={activeItem === 'Sessions' ? 'active' : ''} onClick={() => handleItemClick('Sessions')}>
        Sessions
        </li> 

        {
          clickedSession !== 'not clicked' && 
          (<li className={activeItem === 'Contact' ? 'active' : ''} onClick={() => handleItemClick('Contact')}>
          Live Session
           {/* <span>{dataFromChild}</span> */}
        </li>)
        }
        
        <li className={activeItem === 'Speakers' ? 'active' : ''} onClick={() => handleItemClick('Speakers')}>
        Speakers
        </li> 

        <li className={activeItem === 'Attendees' ? 'active' : ''} onClick={() => handleItemClick('Attendees')}>
          Attendees
        </li>
        
        <li className={activeItem === 'Query' ? 'active' : ''} onClick={() => handleItemClick('Query')}>
          Query
        </li>
        <li className={activeItem === 'Update Profile' ? 'active' : ''} onClick={() => handleItemClick('Update Profile')}>
          Update Profile
        </li>
      </ul>
      <div className="main-content" style={{ maxHeight: '100vh', overflowY: 'scroll' }}>
        {/* {activeItem === 'Home' && (
          <div>
            <MainContent />
            <h2>Home</h2>
            <p>Welcome to the Home page!</p>
          </div>
        )} */}
        {
          (activeItem === 'Agenda' && props.userType === 'Admin') && (
            (<Agenda globalEventId={props.globalEventId} />)
            
          )
        }
        {
          activeItem === 'Sessions' && (
            <SessionsTab globalEventId={props.globalEventId} setActiveSession = {setActiveSession} activeParticipantCount={dataFromChild} setActiveItem={setActiveItem} setClickedSession={setClickedSession} clickedSession={clickedSession}/>
          )
        }
        {activeItem === 'Contact' && (
          <div>
            {/* <ExcelSheetInput /> */}
            <JitsiComponent onChildClick={handleChildData} roomName={activeSession.sessionRoom} globalEventId={props.globalEventId} userName={currentUser.displayName} activeSession={activeSession}/>
          </div>
        )}
        {activeItem === 'Speakers' && (
          <Speakers globalEventId={props.globalEventId} />
        )}
        {activeItem === 'Attendees' && (
            <Attendees globalEventId={props.globalEventId} />
        )}
        {activeItem === 'Query' && (
          <div >
            {/* <ExcelSheetInput /> */}
            <ChatBox userType={props.userType}/>
          </div>
        )}
        {(activeItem === 'Update Profile' && props.userType === 'Speaker') && (
          <div >
          <UpdateSpeakerProfile globalEventId={props.globalEventId} user={currentUser} />
          </div>
        )}
        {(activeItem === 'Update Profile' && props.userType !== 'Speaker') && (
          <div >
          <UpdateAttendeeProfile globalEventId={props.globalEventId} user={currentUser} />
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
