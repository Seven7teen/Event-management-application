import React, {useState, useEffect} from "react";
import * as xlsx from 'xlsx';
import './styles.css';
import "./speaker-styles.css";
import firebase from '../../../../firbase';
import { blue } from "@material-ui/core/colors";


const db = firebase.firestore();


const Speakers = (props) => {
    const [importedData, setImportedData] = useState([]);
    const [bioExtend, setBioExtend] = useState({
        index: 0,
        check: false
    });

    useEffect(() => {
        db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setImportedData(doc.data().speakers);            
            }
        });
    },[]);

    const handleExtend = (param) => {
        setBioExtend({
            index: param,
            check: true
        });
    }

    const handleChat = async (user2email, user2Name) => {
        props.setUser2Id(user2email);
        props.setUser2Name(user2Name);
        props.setActiveItem('OneToOneChat');
    }



    return (
        <>
            <div className="speakers-tab">
                <div className="speakers-body">

                    {
                        importedData && importedData.map((item, index) => (

                            <div className="speakers-day" key={index}>
                                <div className='imgH4'>
                                    
                                    <img src={item.speakerProfilePicURL} alt='imggg'/>

                                    <div className="speakers-events" style={{textAlign: 'left'}}>
                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Education</h4>
                                        <p>{item.speakerEducation}</p>
                                    </div>
                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Location</h4>
                                        <p>{item.speakerLocation}</p>
                                    </div>

                                    {/* <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Position</h4>
                                        <p>{item.speakerPosition}</p>
                                    </div> */}
                                    </div>
                                    
                                    </div>
                                    <div className="speakers-events" style={{textAlign: 'left'}}>
                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>{item.speakerName ? item.speakerName : null}</h4>
                                        <p>{item.speakerPosition ? item.speakerPosition : 'null'}</p>
                                        {/* <p>Speakers</p> */}
                                    </div>
                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Bio</h4>
                                        {
                                            (bioExtend.check === true && bioExtend.index === index) ? (<p>{item.speakerBio}</p>) : (<div>
                                                <p>{item.speakerBio.substring(0, 300) + " ..."} <span style={{color: 'blue'}} onClick={() => handleExtend(index)}>Read more</span></p>
                                            </div>)
                                        }
                                       
                                        
                                    </div>

                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Affiliation</h4>
                                        <p>{item.speakerAffiliation}</p>
                                    </div>
                                   
                                   

                                    <div className="speakers-event">
                                        <h4 style={{padding: "0.5rem 0"}}>Personal Website</h4>
                                        <p>{item.speakerPersonalWebsites}</p>
                                    </div>
                                    <div className="speakers-buttons">
                                        {props.myEmail !== item.speakerEmail && 
                                            <button type="button" className="btn btn-light btn-sm" onClick={() => handleChat(item.speakerEmail, item.speakerName)}>Send Message</button>
                                        }
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

export default Speakers;