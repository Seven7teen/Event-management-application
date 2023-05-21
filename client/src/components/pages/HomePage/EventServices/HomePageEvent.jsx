import React, {useState, useEffect} from "react";
import firebase from "../../../../firbase";
import { homeObjOne } from "../Data";
import "./homeEvent.css";

const db = firebase.firestore();

const HomePageEvent = (props) => {
    const [eventPictureUrl, setEventPictureUrl] = useState("");
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [sponsors, setSponsors] = useState([]);

    useEffect(async () => {
        await db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists) {
                if(doc.data().sponsors) {
                    const strSponsor = doc.data().sponsors;
                    const sponsors = strSponsor.split(",");
                    setSponsors(sponsors);
                }
                setTitle(doc.data().globalEventName);
                setDesc(doc.data().globalEventDescription);
                setStartDate(doc.data().startDate);
                setEndDate(doc.data().endDate);
                setEventPictureUrl(doc.data().eventPictureUrl);
                
            }
        })
    })

    return (
        <div className="flex-container homePageNoback">
            <div className="flexItem main">
                <img className="img-container" src={eventPictureUrl} alt="imgg"/>
                <div style={{backgroundColor: "#f2f1ef"}}>
                <div style={{textAlign: "left", color: "#60686b", margin: "1rem 0.5rem 0 0.5rem", paddingTop: "10px"}}>Event Description</div>
                <div className="event-description">
                    {desc}
                </div>
                </div>
                
            </div>
            <div className="flexItem sponsor">
                {/* <h4>Sponsors</h4> */}
                <div style={{textAlign: "left", color: "#60686b", margin: "0rem 0.5rem"}}>Sponsors</div>

                <div className="sponsor-events">
                {(sponsors && sponsors.length > 0) && sponsors.map((item, index) => (
                    // <div className="attendee-day" key={index}>
                        
                            <div className="sponsor-event">
                                <h4>{item ? item : null}</h4>
                            </div>
                    
                    // </div>
                )
                )}
                </div>
            </div>
        </div>
    )


}

export default HomePageEvent;