import React, { useState } from "react";

// import { addDoc, collection, serverTimestamp } from "firebase/firestore";

import { auth} from "../../../../firbase";
import firebase from "../../../../firbase";
import "./chat.css";

const db = firebase.firestore();


const SendMessage = ({ scroll, userType }) => {
  const [message, setMessage] = useState("");

  const sendMessage = async (event) => {
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, photoURL } = auth.currentUser;


    // await addDoc(collection(db, "messages"), {
    //   text: message,
    //   name: displayName,
    //   avatar: photoURL,
    //   createdAt: serverTimestamp(),
    //   uid,
    // });

    await db.collection("messages").add({
        text: message,
        name: displayName,
        avatar: photoURL,
        userType: userType,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        uid,
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });
    setMessage("");
    scroll.current.scrollIntoView({ behavior: "smooth" });
  };
  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message">
      <label htmlFor="messageInput" hidden>
        Enter Message
      </label>
      <input
        id="messageInput"
        name="messageInput"
        type="text"
        className="form-input__input"
        placeholder="type message..."
        value={message}
        onChange={(e) => setMessage(e.target.value)}
      />
      <button type="submit">Send</button>
    </form>
  );
};

export default SendMessage;