import React, { useState, useEffect } from "react";
import { auth} from "../../../../firbase";
import firebase from "../../../../firbase";
import "./chat.css";

const db = firebase.firestore();


const PersonalSendMessage = ({ scroll, user2Id }) => {
  const [message, setMessage] = useState("");
  const [avatarURL, setAvatarURL] = useState("images/other.jpg");
  const [receiverId, setReceiverId] = useState();

  useEffect( async () => {
    await db.collection('users').doc(auth.currentUser.uid).get().then((doc) => {
      if(doc.exists) {
        const url = doc.data().photoURL;
        setAvatarURL(url);
        setReceiverId(doc.data().userId);
      }
    })
  })


  const sendMessage = async (event) => {
    console.log(avatarURL);
    event.preventDefault();
    if (message.trim() === "") {
      alert("Enter valid message");
      return;
    }
    const { uid, displayName, email } = auth.currentUser;

    await db.collection("OneToOneChat").doc("userCombination").collection(email + user2Id).add({
    // await db.collection("globalEvents").doc(globalEventId).collection("messages").add({
        text: message,
        senderName: displayName,
        avatar: avatarURL,
        createdAt: firebase.firestore.FieldValue.serverTimestamp(),
        senderEmail: email,
        uid,
    })
    .then((docRef) => {
        console.log("Document written with ID: ", docRef.id);
    })
    .catch((error) => {
        console.error("Error adding document: ", error);
    });

    await db.collection("OneToOneChat").doc("userCombination").collection(user2Id + email).add({
      // await db.collection("globalEvents").doc(globalEventId).collection("messages").add({
          text: message,
          senderName: displayName,
          avatar: avatarURL,
          createdAt: firebase.firestore.FieldValue.serverTimestamp(),
          senderEmail: email,
          uid,
      })
      .then((docRef) => {
          console.log("Document written with ID: ", docRef.id);
      })
      .catch((error) => {
          console.error("Error adding document: ", error);
      });

  };

  return (
    <form onSubmit={(event) => sendMessage(event)} className="send-message" style={{width: "83%"}}>
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

export default PersonalSendMessage;