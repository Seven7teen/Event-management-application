import React, { useState, useEffect } from 'react';
import firebase from "../../../../firbase";
import { useAuth } from '../../../Auth/AuthContext';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '25ch',
    },
  },
}));

const UpdateAttendeeProfile = (props) => {
  const classes = useStyles();
  const {currentUser} = useAuth();
  const [attendeeName, setAttendeeName] = useState('');
  const [organization, setOrganization] = useState('');
  const [profession, setProfesssion] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [bio,setBio] = useState();

  useEffect(async () => {
    console.log("userEmail: " + currentUser.email)
    const docref = db.collection('globalEvents').doc(props.globalEventId);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        let newArrField = [...doc.data().attendees];
        newArrField.map((item,index) => {
          if(item.attendeeEmail === currentUser.email) {
            console.log(index);
            console.log(newArrField[index]);
            const dataObject = newArrField[index];
            setAttendeeName(dataObject.attendeeName);
            setOrganization(dataObject.organization);
            setProfesssion(dataObject.profession);
            setBio(dataObject.bio);
          }
        })
      }
    })
  },[]);


  const handleFormSubmit = async (e) => {
    e.preventDefault();
    let profilePicUrl = "images/other.jpg";

    if(profilePic) {
      const storageRef = firebase.storage().ref();
      const profilePicRef = storageRef.child(profilePic.name);
      await profilePicRef.put(profilePic);
      profilePicUrl = await profilePicRef.getDownloadURL();
    }

    const userRef = db.collection('users').doc(currentUser.uid);
    await userRef.update({
      photoURL: profilePicUrl
    });

    const docref = db.collection('globalEvents').doc(props.globalEventId);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        let newArrField = [...doc.data().attendees];
        newArrField.map((item,index) => {

          if(item.attendeeEmail === currentUser.email) {
            const updatedObject = {...newArrField[index],
                bio: bio,
                organization: organization,
                profession: profession,
                attendeeName: attendeeName,
                profilePicURL: profilePicUrl
              };
            
              const updatedWithoutPhotoObject = {...newArrField[index],
                bio: bio,
                organization: organization,
                profession: profession,
                attendeeName: attendeeName,
              };

            newArrField[index] = profilePic ? updatedObject : updatedWithoutPhotoObject;

            docref.set({attendees: newArrField}, {merge: true})
            .then(() => {
              console.log('Document updated successfully');
              props.setActiveItem('Attendees');
            })
            .catch((error) => {
              console.error('Error updating document:', error);
            });
          }

        });
      } else {
        console.log("doc not found");
      }
    });
    

    // Perform registration logic here
    // Access form data: firstName, lastName, email, password, profilePic
  };

  const handleProfilePicChange = (e) => {
    const file = e.target.files[0];
    setProfilePic(file);
  };

  return (
    <form onSubmit={handleFormSubmit} className={classes.root} style={{backgroundColor: "#f2f1ef", padding: "1.5rem"}}>

      <label htmlFor="attendeeName">Attendee Name:</label>
        <TextField
          required id="attendeeName"
          value={attendeeName}
          placeholder='attendeeName'
          onChange={(e) => setAttendeeName(e.target.value)}
        />

      <label htmlFor="organization">Organization:</label>
        <TextField
          required id="organization"
          value={organization}
          placeholder='organization'
          onChange={(e) => setOrganization(e.target.value)}
        />


        <label htmlFor="profession">Profession:</label>
            <TextField
              required id="profession"
              value={profession}
              placeholder='profession'
              onChange={(e) => setProfesssion(e.target.value)}
            />

      <label htmlFor="profilePic">Profile Picture:</label>
        <input
        style={{display: "inline-block"}}
          type="file"
          className="form-control"
          id="profilePic"
          onChange={handleProfilePicChange}
        />

      <div style={{width: "100%"}}>
        <label htmlFor="bio">Bio:</label>
        <TextField
            id="bio"
            placeholder="Bio(max 1000 char)"
            multiline
            // rows={4}
            // variant="outlined"
            value={bio}
            onChange={(e) => setBio(e.target.value) }
            inputProps={{maxLength: 1000}}
            fullWidth
        />
      </div>

      {/* <div style={{textAlign: "center"}}> */}
      <button type="submit" className="btn btn-success">Submit</button>
    {/* </div> */}
    </form>
  );
};

export default UpdateAttendeeProfile;
