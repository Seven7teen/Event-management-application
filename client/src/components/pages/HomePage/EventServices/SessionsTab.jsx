import React, { useEffect, useState } from 'react';
import { BsFillCalendarPlusFill } from 'react-icons/bs';
import * as xlsx from 'xlsx';
import './styles.css';
import firebase from '../../../../firbase';


const db = firebase.firestore();

const SessionsTab = (props) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [activeTab, setActiveTab] = useState('Full Agenda');
  const [importedData, setImportedData] = useState([]);
  const [dayWiseData, setdayWiseData] = useState([]);
  const [duration, setDuration] = useState({
    startDate: new Date(),
    endDate: new Date()
  });

  useEffect(() => {
      db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
        if(doc.exists){
            const old = doc.data().sessions;
            const res = old.filter((item) => {
              return new Date(item.date).getTime() === currentDate.getTime();
            })
            setImportedData(res);            
          }
    });
  },[currentDate]);

  // useEffect(() => {

    


  // },[currentDate])

//   useEffect(() => {
//     db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
//       if(doc.exists){          
//           let ev = doc.data().sessions;
//           let arr = [];
//           if(ev){
//               doc.data().sessions.forEach((ele,ind) => {

                
//                   // console.log(el.id);
//                   if(ele.id===id){
//                       // console.log("now");
//                       ev[ind] = {...eve,id:id,primary:false};
//                       console.log(ev);
//                       db.collection("users").doc(el.id).update({
//                           events: ev
//                       })
//                   }
//               })
//           }


//         }
//   });
// },[]);

  useEffect(() => {
    db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
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
  db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
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
        {
          (activeTab === 'Full Agenda' && importedData) && 
            importedData.map((item, index) => (

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

                    <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
                  </div>
                </div>
              </div>
              </div>
              // <div key={index}>
              // <p>{item.date ? item.date : null}</p>
              // <p>{item.timeStart ? item.timeStart.toString() : 'null'}</p>
              // <p>{item.timeEnd ? item.timeEnd : 'null'}</p>
              // <p>{item.tracks ? item.tracks : 'null'}</p>
              // <p>{item.sessionTitle ? item.sessionTitle : 'null'}</p>
              // <p>{item.location ? item.location : 'null'}</p>
              // <p>{item.description ? item.description : 'null'}</p>
              // <p>{item.speakers ? item.speakers : 'null'}</p>
              // <p>{item.authors ? item.authors : 'null'}</p>
              // <p>==================================</p>
              // </div>
            )
          )
        }

        {activeTab === 'Full Agenda' && (
          <div>
            {/* <MainContent /> */}
            <h2>Full</h2>
            <p>Welcome to the Speaker page!</p>
          </div>
        )}
        {activeTab === 'My Agenda' && (
          <div>
            {/* <MainContent /> */}
            <h2>Home to My agenda</h2>
            <p>Welcome to the Speaker page my agenda!</p>
          </div>
        )}
        {/* <div className="session-day">
          <div className='imgH3'>
            <h3>9:00am - 10:00am</h3>
            <img src='/images/conference.png' alt='imggg'/>
            <p>Conference</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div> */}
        {/* <div className="session-day">
          <div className='imgH3'>
            <h3>{currentDate.toDateString()}</h3>
            <img src='/images/home1.svg' alt='imggg'/>
            <p>Trade Show</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div>
        <div className="session-day">
          <div className='imgH3'>
            <h3>{currentDate.toDateString()}</h3>
            <img src='/images/networking-event.avif' alt='imggg'/>
            <p>Networking event</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div>
        <div className="session-day">
          <div className='imgH3'>
            <h3>{currentDate.toDateString()}</h3>
            <img src='/images/seminar.jpg' alt='imggg'/>
            <p>Seminar</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div>
        <div className="session-day">
          <div className='imgH3'>
            <h3>{currentDate.toDateString()}</h3>
            <img src='/images/workshops.jpg' alt='imggg'/>
            <p>Workshop</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div> */}
        {/* <div className="session-day">
          <div className='imgH3'>
            <h3>{currentDate.toDateString()}</h3>
            <img src='/images/other.jpg' alt='imggg'/>
            <p>Other</p>
          </div>
          <div className="session-events">
            <div className="session-event">
              <h4>Title</h4>
              <p>Description</p>
              <p>Speaker Name</p>
            </div>
            <div className="session-buttons">
              <button type="button" className="btn btn-light">View Session</button>

              <button type="button" className="btn btn-light">< BsFillCalendarPlusFill /> Add to My Agenda</button>
            </div>
          </div>
        </div> */}
      </div>
    </div>
  );
};

export default SessionsTab;
