import React, { useContext, useEffect, useState} from 'react';
import * as xlsx from 'xlsx';
import './calendar.css';
import { useAuth } from '../Auth/AuthContext';
import firebase from "../../firbase";
import Fab from '@material-ui/core/Fab';
import { makeStyles } from '@material-ui/core/styles';
import ReactNotification from 'react-notifications-component';
import {store} from 'react-notifications-component';
import 'animate.css'
import moment from 'moment';
import 'react-notifications-component/dist/theme.css'
import Sidebar from '../Sidebar/Sidebar';


// import axios from "axios";
require('dotenv').config();

const db = firebase.firestore();

const RegisterAttendees = () => {
  const [users, setUsers] = useState([]);

  const handleFileSelect = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onload = (e) => {
      const data = new Uint8Array(e.target.result);
      const workbook = xlsx.read(data, { type: 'array' });
      const sheet = workbook.Sheets['Sheet1'];
      const userData = xlsx.utils.sheet_to_json(sheet);

      // Extract email and password for each user
      const userList = userData.map((row) => ({
        email: row['Email'],
        password: row['Password'],
      }));

      setUsers(userList);
    };

    reader.readAsArrayBuffer(file);
  };

  const registerUsers = () => {
    users.forEach((user) => {
      createUser(user.email, user.password);
    });
  };

  const createUser = async (email, password) => {
    try {
      await firebase.auth().createUserWithEmailAndPassword(email, password);
      console.log(`Successfully created user with email: ${email}`);
    } catch (error) {
      console.error(`Error creating user: ${error}`);
    }
  };

  return (
    <>
        <ReactNotification />
        <Sidebar
                visible={false}
            />
        <input type="file" accept=".xlsx" onChange={handleFileSelect} />
        <button onClick={registerUsers}>Register Users</button>
    </>
  );
};

export default RegisterAttendees;
