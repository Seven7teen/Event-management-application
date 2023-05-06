import React, { useEffect, useRef, useState } from "react";
import "./chat.css";

// import {
//   query,
//   collection,
//   orderBy,
//   onSnapshot,
//   limit,
// } from "firebase/firestore";

import firebase from '../../../../firbase';

import Message from "./Message";
import SendMessage from "./SendMessage";

const db = firebase.firestore();

const ChatBox = ({userType}) => {
  const [messages, setMessages] = useState([]);
  const scroll = useRef();

  useEffect(() => {
    // const q = query(
    //   collection(db, "messages"),
    //   orderBy("createdAt"),
    //   limit(50)
    // );

    // const unsubscribe = onSnapshot(q, (QuerySnapshot) => {
    //   let messages = [];
    //   QuerySnapshot.forEach((doc) => {
    //     messages.push({ ...doc.data(), id: doc.id });
    //   });
    //   setMessages(messages);
    // });
    // return () => unsubscribe;

    db.collection("messages").orderBy("createdAt").limit(50)
    .onSnapshot((querySnapshot) => {
        let messages = [];
        querySnapshot.forEach((doc) => {
            messages.push({...doc.data(), id: doc.id});
        });
        setMessages(messages);
    });

  }, []);

  return (
    <main className="chat-box">
      <div className="messages-wrapper">
        {messages?.map((message) => (
          <Message key={message.id} message={message} />
        ))}
      </div>
      {/* when a new message enters the chat, the screen scrolls dowwn to the scroll div */}
      <span ref={scroll}></span>
      <SendMessage scroll={scroll} userType={userType}/>
    </main>
  );
};

export default ChatBox;