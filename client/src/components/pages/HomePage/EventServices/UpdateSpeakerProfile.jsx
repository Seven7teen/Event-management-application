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

const UpdateSpeakerProfile = (props) => {
  const classes = useStyles();
    const {currentUser} = useAuth();
  const [speakerName, setSpeakerName] = useState('');
  const [speakerAffiliation, setSpeakerAffiliation] = useState('');
  const [speakerEducation, setSpeakerEducation] = useState('');
  const [profilePic, setProfilePic] = useState(null);
  const [speakerBio,setSpeakerBio] = useState('');
  const [speakerLocation,setSpeakerLocation] = useState('');
  const [speakerPosition,setSpeakerPosition] = useState('');
  const [speakerPersonalWebsites,setSpeakerPersonalWebsites] = useState('');

  useEffect(async () => {
    // console.log("userEmail: " + currentUser.email)
    const docref = db.collection('globalEvents').doc(props.globalEventId);
    await docref.get().
    then((doc) => {
      if(doc.exists) {
        let newArrField = [...doc.data().speakers];
        newArrField.map((item,index) => {
          if(item.speakerEmail === currentUser.email) {
            console.log(index);
            console.log(newArrField[index]);
            const dataObject = newArrField[index];
            setSpeakerName(dataObject.speakerName);
            setSpeakerAffiliation(dataObject.speakerAffiliation);
            setSpeakerEducation(dataObject.speakerEducation);
            setSpeakerBio(dataObject.speakerBio);
            setSpeakerLocation(dataObject.speakerLocation);
            setSpeakerPosition(dataObject.speakerPosition);
            setSpeakerPersonalWebsites(dataObject.speakerPersonalWebsites);
          }
        })
      }
    })
  },[]);


  const handleFormSubmit = async (e) => {
    console.log("clicked");
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
        let newArrField = [...doc.data().speakers];
        newArrField.map((item,index) => {

          if(item.speakerEmail === currentUser.email) {
            const updatedObject = {...newArrField[index],
                speakerBio: speakerBio,
                speakerAffiliation: speakerAffiliation,
                speakerEducation: speakerEducation,
                speakerName: speakerName,
                speakerProfilePicURL: profilePicUrl,
                speakerLocation: speakerLocation,
                speakerPersonalWebsites: speakerPersonalWebsites,
                speakerPosition: speakerPosition
              };
            
              const updatedWithoutPhotoObject = {...newArrField[index],
                speakerBio: speakerBio,
                speakerAffiliation: speakerAffiliation,
                speakerEducation: speakerEducation,
                speakerName: speakerName,
                speakerLocation: speakerLocation,
                speakerPersonalWebsites: speakerPersonalWebsites,
                speakerPosition: speakerPosition
              };

            newArrField[index] = profilePic ? updatedObject : updatedWithoutPhotoObject;

            docref.set({speakers: newArrField}, {merge: true})
            .then(() => {
              console.log('Document updated successfully');
              props.setActiveItem('Speakers');
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
    <form onSubmit={handleFormSubmit} className={classes.root} style={{backgroundColor: "#F7F8FA", padding: "1.5rem", boxShadow: "3px 3px 20px rgba(0, 0, 0, 0.2)"}}>

      <label htmlFor="speakerName">Speaker Name:</label>
      <TextField required id="speakerName" placeholder="Name" value={speakerName} onChange={(e) => setSpeakerName(e.target.value)}/>
      <br />

        <label htmlFor="speakerAffiliation">Affiliation:</label>
        <TextField
          required id="speakerAffiliation"
          value={speakerAffiliation}
          placeholder='Affiliation'
          onChange={(e) => setSpeakerAffiliation(e.target.value)}
        />
        <br />

      <label htmlFor="speakerEducation">Education:</label>
              <TextField
                required id="speakerEducation"
                value={speakerEducation}
                placeholder='Education'
                onChange={(e) => setSpeakerEducation(e.target.value)}
              />
              <br />

        <label htmlFor="speakerPosition">Position:</label>
              <TextField
                required id="speakerPosition"
                value={speakerPosition}
                placeholder='Position'
                onChange={(e) => setSpeakerPosition(e.target.value)}
              />
              <br />

      <label htmlFor="speakerLocation">Location:</label>
              <TextField
                required id="speakerLocation"
                value={speakerLocation}
                placeholder='Location'
                onChange={(e) => setSpeakerLocation(e.target.value)}
              />
              <br />

      <label htmlFor="speakerPersonalWebsites">Personal Websites:</label>
              <TextField
                required id="speakerPersonalWebsites"
                value={speakerPersonalWebsites}
                placeholder='Personal Websites'
                onChange={(e) => setSpeakerPersonalWebsites(e.target.value)}
              />
              <br />

        <label htmlFor="profilePic">Profile Picture:</label>
        <input
        style={{display: "inline-block"}}
          type="file"
          className="form-control"
          id="profilePic"
          onChange={handleProfilePicChange}
        />
        <br />

      {/* </div> */}
      <div style={{width: "100%"}}>
        <label htmlFor="bio">Bio:</label>
        <TextField
            id="bio"
            placeholder="Bio(max 1000 char)"
            multiline
            // rows={4}
            // variant="outlined"
            value={speakerBio}
            onChange={(e) => setSpeakerBio(e.target.value) }
            inputProps={{maxLength: 1000}}
            fullWidth
        />
      </div>
      
     

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default UpdateSpeakerProfile;
