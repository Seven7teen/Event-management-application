import React, { useEffect, useRef, useState } from "react";
import "./chat.css";

import firebase from '../../../../firbase';

import Message from "./Message";
import SendMessage from "./SendMessage";

const db = firebase.firestore();

const ChatBox = ({userType, globalEventId}) => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {

    db.collection("globalEvents").doc(globalEventId).collection("messages").orderBy("createdAt").limit(50)
    .onSnapshot((querySnapshot) => {
        let messages = [];
        querySnapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id});
        });
        setMessages(messages);
    });

  }, []);

  return (
    <>
    <main className="chat-box">
      <h4>Community</h4>
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} userType={userType} globalEventId={globalEventId}/>
    </main>
    </>
  );
};

export default ChatBox;