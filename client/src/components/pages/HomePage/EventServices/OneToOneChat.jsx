import React, { useEffect, useRef, useState } from "react";
import "./chat.css";
import {useAuth} from "../../../Auth/AuthContext";
import firebase from '../../../../firbase';
import PersonalChatMessage from "./PersonalChatMessage";
import PersonalSendMessage from "./PersonalSendMessage";

const db = firebase.firestore();

//sender email
// text
//created at
//my avatar
//my name


const OneToOneChat = (props) => {
    const [messages, setMessages] = useState([]);
    const {currentUser} = useAuth();
    const scroll = useRef();

    useEffect(() => {
        db.collection("OneToOneChat").doc("userCombination").collection(currentUser.email + props.user2Id).orderBy("createdAt").limit(50)
        .onSnapshot((querySnapshot) => {
                let messages = [];
                querySnapshot.forEach((doc) => {
                    messages.push({...doc.data(), id: doc.id});
                    console.log("Document ID:", doc.id);
                    console.log("Document Data:", doc.data());
                  });
                  setMessages(messages);
        });
      }, []);

    return (
        <>
            <h3>{props.user2Name}</h3>
            <main className="chat-box">
            <div className="messages-wrapper">
                {messages?.map((message) => (
                <PersonalChatMessage key={message.id} message={message} />
                ))}
            </div>
            {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
            <span ref={scroll}></span>
            <PersonalSendMessage scroll={scroll} user2Id={props.user2Id}/>
            </main>
        </>
    );

};

export default OneToOneChat;