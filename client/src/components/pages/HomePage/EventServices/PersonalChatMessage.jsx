import React from "react";
import { useAuth } from '../../../Auth/AuthContext';
import firebase from '../../../../firbase';
import "./chat.css";

const PersonalChatMessage = ({ message }) => {
//   const [user] = useAuthState(auth);
  const {currentUser} = useAuth();

  return (
    <div
      className={`chat-bubble ${message.senderEmail === currentUser.email ? "right" : ""}`}>
      <img
        className="chat-bubble__left"
        src={message.avatar}
        alt="user avatar"
      />
      <div className="chat-bubble__right">
        <p className="user-name">{message.senderName} </p>
        <p className="user-message">{message.text}</p>
      </div>
    </div>
  );
};

export default PersonalChatMessage;