import React, {useState, useEffect} from "react";
import * as xlsx from 'xlsx';
import './styles.css';
import firebase from '../../../../firbase';


const db = firebase.firestore();


const Attendees = (props) => {
    const [importedData, setImportedData] = useState([]);
    const [selectedElement, setSelectedElement] = useState(null);


    useEffect(() => {
        db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setImportedData(doc.data().attendees);            }
        });
    },[]);

    const handleElementClick = (element) => {
        setSelectedElement(element);
      };

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
                                        <button type="button" className="btn btn-light btn-sm" data-toggle="modal" data-target={"#" + item.attendeeName.replaceAll(' ', '-')} onClick={() => handleElementClick(item)}>View Profile</button>
                                    </div>

                            {/* // <!-- Modal --> */}
                                </div>
                            </div>

                            // <!-- Button trigger modal -->
                            
                            )
                        )
                    }
                </div>
                
            </div>


            {selectedElement && (
                // <!-- Modal -->
                <div class="modal fade" id={selectedElement.attendeeName.replaceAll(' ', '-')} tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                  <div class="modal-dialog" role="document">
                    <div class="modal-content">
                      <div class="modal-header">
                        <h5 class="modal-title" id="exampleModalLabel">{selectedElement.attendeeName}</h5>
                        {/* <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                          <span aria-hidden="true">&times;</span>
                        </button> */}
                      </div>
                      <div class="modal-body">
                      <img src={selectedElement.profilePicURL} alt='imggg' style={{borderRadius: "100%", width: "150px", height: "150px"}}/>
                      <p>Organization: {selectedElement.organization}</p> {/* Replace with the appropriate property */}
                        <p>Profession: {selectedElement.profession}</p>
                        <p>Bio: {selectedElement.bio}</p>
                      </div>
                      <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" data-dismiss="modal" onClick={() => setSelectedElement(null)}>Close</button>
                      </div>
                    </div>
                  </div>
                </div>
            )}
        </>
    )

    

}

export default Attendees;