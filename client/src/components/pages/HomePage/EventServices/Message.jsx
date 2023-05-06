import React from "react";
// import { auth } from "../../../../firbase";
import { useAuth } from '../../../Auth/AuthContext';
import firebase from '../../../../firbase';
// import { useAuthState } from "react-firebase-hooks/auth";
import "./chat.css";

const Message = ({ message, userType }) => {
//   const [user] = useAuthState(auth);
  const {currentUser} = useAuth();
  console.log(message.uid);
  console.log(userType);
  return (
    <div
      className={`chat-bubble ${message.uid === currentUser.uid ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.name} </p>
        <p className="user-name">{message.userType ? message.userType : "Attendee"}</p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default Message;