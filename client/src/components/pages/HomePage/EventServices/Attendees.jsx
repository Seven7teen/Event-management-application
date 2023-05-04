import React, {useState, useEffect} from "react";
import * as xlsx from 'xlsx';
import './styles.css';
import firebase from '../../../../firbase';


const db = firebase.firestore();


const Attendees = (props) => {
    const [importedData, setImportedData] = useState([]);

    useEffect(() => {
        db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setImportedData(doc.data().attendees);            }
        });
    },[]);

    return (
        <>

            <div className="attendee-tab">
                <div className="attendee-body">

                    {
                        importedData && importedData.map((item, index) => (

                            <div className="attendee-day" key={index}>
                                <div className='imgH3'>
                                    
                                    <img src={item.profilePicURL} alt='imggg'/>
                                    
                                    </div>
                                    <div className="attendee-events">
                                    <div className="attendee-event">
                                        <h4>{item.attendeeName ? item.attendeeName : null}</h4>
                                        <p>{item.profession ? item.profession : 'null'}</p>
                                        <p>{item.organization ? item.organization : 'null'}</p>
                                    </div>
                                    <div className="attendee-buttons">
                                        <button type="button" className="btn btn-light btn-sm">Send Message</button>
                                        <button type="button" className="btn btn-light btn-sm">View Profile</button>
                                    </div>
                                </div>
                            </div>
                            )
                        )
                    }
                </div>
                
            </div>
        </>
    )

    

}

export default Attendees;