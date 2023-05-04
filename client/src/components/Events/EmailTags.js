import React, { useEffect, useState } from 'react';
import firebase from '../../firbase';
import './tags.css';
import * as xlsx from 'xlsx';


require('dotenv').config();

const db = firebase.firestore();

function EmailTags(props) {

    const [error,setError] = useState(null);
    const [value,setValue] = useState('');
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const handleDelete = item => {
        props.setPid(props.pid.filter(i => i.email!==item));
        // props.setPeople(props.people.filter(i => i!==item));
    }

    const handleChange = e => {
        setValue(e.target.value);
        setError(null);
    }

    const handleKeyDown = async e => {
        // console.log(e.target);
        if(["Enter","Tab", ","].includes(e.key)) {
            var val = value.trim();
            if(val && (await isValid(val,"inputField"))){
                // props.setPeople((prev) => ([
                //     ...prev,
                //     val
                // ]));
                await setId(val);
                setValue("");
            }
        }
    }

    const setId = async (val) => {
        var arr = [...props.pid];
        // console.log("sdsd", arr);
        await db.collection('users').get().then((qSnap) => {
            qSnap.forEach((doc) => {
                // console.log(doc.data().email);
                // console.log(val);
                if(doc.data().email===val){
                    console.log("yes");
                    arr.push({
                        email: val,
                        id: doc.id
                    });
                    // props.setPid((prev) => [
                    //     ...prev,
                    //     doc.id
                    // ])
                }
            })
        })
        props.setPid(arr);
        console.log(arr);
    }

    const handlePaste =async e => { /* Adding one email by copying from clipboard */
        e.preventDefault();

        var paste = e.clipboardData.getData("text");
        console.log(paste);
        
        var emails = paste.match(/[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/g);

        if (emails) {
            var toBeAdded = emails.filter(email => !isInList(email));
            await setId(paste);
            // props.setPid((prev) => ([
            //     ...prev,
            //     ...toBeAdded
            // ]))
        }
    };

    async function isValid(email,triggeringElement) {
        let err = null;
        // console.log(isCalwinUser(email));
        if(!(await isCalwinUser(email))){
            err = `${email} is not a CalWin User.` ;
        }
        // console.log(isInList(email));
        if (isInList(email)) {
        err = `${email} has already been added.`;
        }

        if (!isEmail(email)) {
        err = `${email} is not a valid email address.`;
        }

        if (err) {
        if(triggeringElement === "inputField") setError(err);
        return false;
        }
        return true;
    }

    async function isCalwinUser(email){
        
        var userRef = db.collection('users');
        var query = userRef.where("email", "==", email);
        let snap =  await query.get();
        
        if(snap.empty){
            return false;
        } else {
            return true;
        }

    }

    function isInList(email) {
        return props.pid.some(el => el.email === email);
    }

    function isEmail(email) {
        return /[\w\d\.-]+@[\w\d\.-]+\.[\w\d\.-]+/.test(email);
    }

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
            email: row['Email']
            // password: row['Password'],
        }));

        setUsers(userList);
        };

        reader.readAsArrayBuffer(file);
    }

    const setUsersId = (userArray) => {
        var darr = [...props.pid];
        console.log(userArray, "useraeea ");
        userArray.forEach(async (val) => {
            await db.collection('users').get().then((qSnap) => {
                qSnap.forEach((doc) => {
                    if(doc.data().email===val.email){
                        console.log("yes");
                        darr.push({
                            email: val.email,
                            id: doc.id
                        });
                    }
                })
            })
        })
        props.setPid(darr);
        console.log(darr);
    }

    const registerUsers = (e) => {
        e.preventDefault();
        users.forEach( async (user) => {
            await createUser(user.email);
        });
        setUsersId(users);

    };

    const createUser = async (val) => {
    try {
        if(val && (await isValid(val,"fileUpload"))){
            console.log(val, "calwin user");
        } else {
            console.log(val, "not a calwin user");
        }
    } catch (error) {
        console.error(`Error creating user: ${error}`);
    }
    };

    return (
        <>
        <h2>Add People</h2>
        {props.pid.map(item => (
          <div className="tag-item" key={item.email}>
            {item.email}
            <button
              type="button"
              className="button"
              onClick={() => handleDelete(item.email)}
            >
              &times;
            </button>
          </div>
        ))}

        <br />
        <input type="file" accept=".xlsx" onChange={handleFileSelect} />
        <button onClick={registerUsers}>Register Users</button>

        <input
          className={"input " + (error && " has-error")}
          value={value}
          placeholder="Type or paste email addresses and press `Enter`..."
          onKeyDown={handleKeyDown}
          onChange={handleChange}
          onPaste={handlePaste}
        />

        {error && <p className="error">{error}</p>}
      </>
    );
}

export default EmailTags;