import React, { useEffect, useState } from 'react';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import { ImBin } from "react-icons/im";
import './styles.css';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import AddSession from './AddSession';
import EditSession from './EditSession';


const db = firebase.firestore();

const SessionsTab = ({globalEventId, setActiveSession, setActiveItem, setClickedSession, clickedSession}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Full Agenda');
  const [importedData, setImportedData] = useState([]);
  const [oldData, setOldData] = useState([]);
  const [dayWiseData, setdayWiseData] = useState([]);
  const {currentUser} = useAuth();
  const [duration, setDuration] = useState({
    startDate: new Date(),
    endDate: new Date()
  });
  const [myAgenda, setMyAgenda] = useState([]);
  const [activePart, setActivePart] = useState(9);
  const [open,setOpen] = useState(false);
  const [editOpenArr, setEditOpenArr] = useState([]);

  useEffect( async () => {
     await db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
      if(doc.exists){
          const sessionArray = doc.data().sessions;
          sessionArray.map((item,index) => {
            if(item.sessionTitle === clickedSession) {
              console.log("no. of active participant is " + item.activeParticipants);
              setActivePart(item.activeParticipants);
            }
          })   
          // const data = doc.data().activeParticipants;
          // setActivePart(data);       
        }
  });
  },[]);

  const showActiveParticipants = async () => {
     await db.collection("globalEvents").doc(globalEventId).onSnapshot((doc) => {
      if(doc.exists){
          const sessionArray = doc.data().sessions;
          sessionArray.map((item,index) => {
            if(item.sessionTitle === clickedSession) {
              console.log("no. of active participant is " + item.activeParticipants);
              setActivePart(item.activeParticipants);
            }
          })
          // const data = doc.data().activeParticipants;
          // setActivePart(data);          
        }
  });
  }

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
    });
    
  }


  useEffect(async () => {
      await db.collection("globalEvents").doc(globalEventId).onSnapshot(async (doc) => {
        if(doc.exists){
            const old = doc.data().sessions;
            let localEditOpenArr = Array(old.length).fill(false);
            const res = await old.filter((item) => {
              return new Date(item.date).getTime() === currentDate.getTime();
            });
            const sortedArr = await res.sort((a, b) => {
              const timeA = new Date("1970/01/01 " + a.timeStart);
              const timeB = new Date("1970/01/01 " + b.timeStart);
            
              return timeA - timeB;
            });
            setOldData(old);
            // setCurrentDate(new Date(doc.data().startDate));
            setImportedData(sortedArr);  
            setEditOpenArr(localEditOpenArr);    
            console.log(old);      
          } 
    });
  },[currentDate]);


  useEffect(() => {
      db.collection("users").doc(currentUser.uid).onSnapshot((doc) => {
        if(doc.exists){
            const old = (doc.data().eventList[0])[globalEventId];
            if(old) {
              const res = old.filter((item) => {
                return new Date(item.date).getTime() === currentDate.getTime();
              });
              const sortedArr = res.sort((a, b) => {
                const timeA = new Date("1970/01/01 " + a.timeStart);
                const timeB = new Date("1970/01/01 " + b.timeStart);
              
                return timeA - timeB;
              });
              setMyAgenda(sortedArr);       
            }     
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

  const handleSession = (item) => {
    setClickedSession(item.sessionTitle);
    setActiveSession(item);
    setActiveItem('Contact');
    console.log(clickedSession);
  }

  const handleAddSession = () => {
    setOpen(true);
  }

  // const deleteSession = async (id) => {
  //   const docref = db.collection("globalEvents").doc(globalEventId);
  //   await docref.get().then(async (doc) => {
  //     if(doc.exists) {
  //       let arr = [...doc.data().sessions];
  //       const index = arr.findIndex(obj => obj.sessionId === id);
  //       arr.splice(index,1);
  //       await docref.update({
  //         sessions: arr
  //       }).then(() => {
  //         console.log("Document deleted successfully");
  //         let updatedArr = [...editOpenArr];
  //         updatedArr.splice(index,1);
  //         setEditOpenArr(updatedArr);
  //     }).catch(err => {
  //         console.error("Error: "+err);
  //     });
  //     }
  //   })
  // }

  const handleEditSession = async (id) => {
    const docref = db.collection("globalEvents").doc(globalEventId);
    await docref.get().then(async (doc) => {
      if(doc.exists) {
        let arr = [...doc.data().sessions];
        const index = arr.findIndex(obj => obj.sessionId === id);
        let updatedArr = [...editOpenArr];
        updatedArr[index] = true;
        setEditOpenArr(updatedArr);
        console.log(updatedArr);
      }
    })
  }

  return (
    <>
    <div className="session-tab">
      <div className="session-header">
        <div>
        <button type='button' className='btn btn-sm-light' onClick={handleAddSession} >Add Session</button>
        <AddSession open={open} setOpen={setOpen} sessionArrayLength={importedData.length} globalEventId={globalEventId} editOpenArr={editOpenArr} setEditOpenArr={setEditOpenArr}/>
        </div>
        <h4 style={{marginBottom: "0"}}>Session Schedule</h4>
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
                <img src={item.sessionImageUrl} alt='imggg'/>
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
                  <button type="button" className="btn btn-light" onClick={() => handleSession(item)}>View Session</button>
                  {item.sessionTitle === clickedSession && 
                  (<button type="button" className="btn btn-light" onClick={() => showActiveParticipants()}>Active {activePart}</button>)}
                  <button type="button" className="btn btn-light" onClick={() => handleAgendaAddition(index)}>< BsFillCalendarPlusFill /> Add to My Agenda</button>
                  {/* <button type="button" className="btn btn-light" onClick={() => deleteSession(item.sessionId)}>< BsFillCalendarPlusFill />Delete</button> */}
                  {currentUser.email === "iit2019009@iiita.ac.in" && <button type="button" className="btn btn-light" onClick={() => handleEditSession(item.sessionId)}>Edit</button>}
                  {/* <EditSession open={editOpenArr} setOpen={setEditOpenArr} element={item} globalEventId={globalEventId}/> */}
                </div>
              </div>
            </div>
            </div>
            ))}



            {oldData && oldData.map((item) => 
              (
              <EditSession open={editOpenArr} setOpen={setEditOpenArr} element={item} globalEventId={globalEventId}/>
              )
            )}
            
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
                            <img src={item.sessionImageUrl} alt='imggg'/>
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
                              <button type="button" className="btn btn-light" onClick={() => handleSession(item)}>View Session</button>
                              {item.sessionTitle === clickedSession && 
                                (<button type="button" className="btn btn-light" onClick={() => showActiveParticipants()} >Active {activePart}</button>)}
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
    </>
  );
};

export default SessionsTab;
