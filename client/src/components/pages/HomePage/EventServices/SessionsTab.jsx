import React, { useEffect, useState } from 'react';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import { ImBin } from "react-icons/im";
import * as xlsx from 'xlsx';
import './styles.css';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import Agenda from './Agenda';


const db = firebase.firestore();

const SessionsTab = ({globalEventId}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Full Agenda');
  const [importedData, setImportedData] = useState([]);
  const [dayWiseData, setdayWiseData] = useState([]);
  const {currentUser} = useAuth();
  const [duration, setDuration] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [myAgenda, setMyAgenda] = useState([]);

  const handleAgendaAddition = async (index) => {
    let firstEventIndex = 0;
    const docref = db.collection('users').doc(currentUser.uid);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        docref.update({
          [`eventList.${firstEventIndex}.${globalEventId}`]: firebase.firestore.FieldValue.arrayUnion(importedData[index])
        })
          .then(() => {
            console.log('Element added to the array successfully!');
          })
          .catch((error) => {
            console.error('Error updating array:', error);
          });
      }
    })
    
  }

  const handleAgendaDeletion = async (index) => {
    let firstEventIndex = 0;
    const docref = db.collection('users').doc(currentUser.uid);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        docref.update({
          [`eventList.${firstEventIndex}.${globalEventId}`]: firebase.firestore.FieldValue.arrayRemove(myAgenda[index])
        })
          .then(() => {
            console.log('Element added to the array successfully!');
          })
          .catch((error) => {
            console.error('Error updating array:', error);
          });
      }
    })
    
  }


  useEffect(() => {
      db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
        if(doc.exists){
            const old = doc.data().sessions;
            const res = old.filter((item) => {
              return new Date(item.date).getTime() === currentDate.getTime();
            })
            setImportedData(res);            
          }
    });
  },[currentDate]);


  useEffect(() => {
      db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
        if(doc.exists){
            const old = (doc.data().eventList[0])[globalEventId];
            const res = old.filter((item) => {
              return new Date(item.date).getTime() === currentDate.getTime();
            })
            setMyAgenda(res);            
          }
    });
  },[currentDate]);

  useEffect(() => {
    db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
      if(doc.exists){
          setDuration({
            startDate: new Date(doc.data().startDate),
            endDate: new Date(doc.data().endDate)
            // traverseDate: new Date(doc.data().startDate)
          });            
        }
  });
},[]);

useEffect(() => {
  db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
    if(doc.exists){
        setCurrentDate(new Date(doc.data().startDate));            
      }
});
},[]);


  const handleNextDayClick = () => {
    // console.log(currentDate.toDateString());
    if(currentDate.getTime() < duration.endDate.getTime()) {
      const nextDate = new Date(currentDate);
      nextDate.setDate(currentDate.getDate() + 1);
      setCurrentDate(nextDate);
    }
  };

  const handlePreviousDayClick = () => {
    // console.log(duration.traverseDate);
    if(currentDate.getTime() > duration.startDate.getTime()) {
      const previousDate = new Date(currentDate);
      previousDate.setDate(currentDate.getDate() - 1);
      setCurrentDate(previousDate);
    }
  };


  const handleTabClick = (tabName) => {

    setActiveTab(tabName);
  }

  return (
    <div className="session-tab">
      <div className="session-header">
        <h2>Session Schedule</h2>
        <button onClick={handlePreviousDayClick}>Previous Day</button>
        <span>{currentDate.toDateString()}</span>
        <button onClick={handleNextDayClick}>Next Day</button>
      </div>
      <br></br>
      <div className="session-header">
        <div className={activeTab === 'Full Agenda' ? 'active agendaTabs' : 'agendaTabs'} onClick={() => handleTabClick('Full Agenda')}>
          Full Agenda
        </div>
        <div className={activeTab === 'My Agenda' ? 'active agendaTabs' : 'agendaTabs'} onClick={() => handleTabClick('My Agenda')}>
          My Agenda
        </div>
      </div>
      <div className="session-body">

        {activeTab === 'Full Agenda' && (
          <div>

            {importedData && importedData.map((item, index) => (
              <div className='session-event'>
              <div className="session-day" key={index}>
              <div className='imgH3'>
                <h3>{item.timeStart} - {item.timeEnd}</h3>
                <img src='/images/conference.png' alt='imggg'/>
                <p>{item.location ? item.location : 'null'}</p>
                <p>{item.tracks ? item.tracks : 'null'}</p>
              </div>
              <div className="session-events">
                <div className="session-event">
                  <h4>{item.sessionTitle ? item.sessionTitle : 'null'}</h4>
                  <p>{item.description ? item.description : 'null'}</p>
                  <p>{item.authors ? item.authors : 'null'}</p>
                  <p></p>
                </div>
                <div className="session-buttons">
                  <button type="button" className="btn btn-light">View Session</button>

                  <button type="button" className="btn btn-light" onClick={() => handleAgendaAddition(index)}>< BsFillCalendarPlusFill /> Add to My Agenda</button>
                </div>
              </div>
            </div>
            </div>
            ))}
            
          </div>
        )}
        {activeTab === 'My Agenda' && (
          <div>
            {
                        myAgenda && myAgenda.map((item, index) => (
                          <div className='session-event'>
                          <div className="session-day" key={index}>
                          <div className='imgH3'>
                            <h3>{item.timeStart} - {item.timeEnd}</h3>
                            <img src='/images/conference.png' alt='imggg'/>
                            <p>{item.location ? item.location : 'null'}</p>
                            <p>{item.tracks ? item.tracks : 'null'}</p>
                          </div>
                          <div className="session-events">
                            <div className="session-event">
                              <h4>{item.sessionTitle ? item.sessionTitle : 'null'}</h4>
                              <p>{item.description ? item.description : 'null'}</p>
                              <p>{item.authors ? item.authors : 'null'}</p>
                              <p></p>
                            </div>
                            <div className="session-buttons">
                              <button type="button" className="btn btn-light">View Session</button>
                              <button type="button" className="btn btn-light" onClick={() => handleAgendaDeletion(index)}>< ImBin /> Remove</button>
                            </div>
                          </div>
                        </div>
                        </div>
                            )
                        )
                    }
          </div>
        )}
      </div>
    </div>
  );
};

export default SessionsTab;
