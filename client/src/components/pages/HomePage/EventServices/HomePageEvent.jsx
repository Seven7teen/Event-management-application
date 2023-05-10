import React, {useState, useEffect} from "react";
import firebase from "../../../../firbase";

const db = firebase.firestore();

const HomePageEvent = (props) => {
    const [eventPictureUrl, setEventPictureUrl] = useState("");
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");

    useEffect(async () => {
        await db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists) {
                setTitle(doc.data().globalEventName);
                setDesc(doc.data().globalEventDescription);
                setStartDate(doc.data().startDate);
                setEndDate(doc.data().endDate);
                setEventPictureUrl(doc.data().eventPictureUrl);
            }
        })
    })

    return (
        <>
            <div>
                <img src={eventPictureUrl} alt="imgg"/>
                <p>{startDate}</p>
                <p>{endDate}</p>
                <p>{title}</p>
                <p>{desc}</p>
            </div>
        </>
    )


}

export default HomePageEvent;