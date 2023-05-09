import React, { useState, useEffect } from 'react';
import firebase from "../../../../firbase";
import { useAuth } from '../../../Auth/AuthContext';


const db = firebase.firestore();

const UpdateSpeakerProfile = (props) => {
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
    e.preventDefault();

    const storageRef = firebase.storage().ref();
    const profilePicRef = storageRef.child(profilePic.name);
    await profilePicRef.put(profilePic);

    const profilePicUrl = await profilePicRef.getDownloadURL();

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
    <form onSubmit={handleFormSubmit}>

      <div className="mb-3">
        <label htmlFor="speakerName" className="form-label">Speaker Name:</label>
        <input
          type="text"
          className="form-control"
          id="speakerName"
          value={speakerName}
          onChange={(e) => setSpeakerName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="speakerAffiliation" className="form-label">Organization:</label>
        <input
          type="text"
          className="form-control"
          id="speakerAffiliation"
          value={speakerAffiliation}
          onChange={(e) => setSpeakerAffiliation(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="speakerEducation" className="form-label">Profession:</label>
        <input
          type="text"
          className="form-control"
          id="speakerEducation"
          value={speakerEducation}
          onChange={(e) => setSpeakerEducation(e.target.value)}
        />
      </div>

      <div className='mb-3'>
          <label for="speakerBio">Bio:</label>
          <textarea className="form-control" id="speakerBio" rows="3" value={speakerBio}  onChange={(e) => setSpeakerBio(e.target.value)}/>
      </div>

      <div className="mb-3">
        <label htmlFor="profilePic" className="form-label">Profile Picture:</label>
        <input
          type="file"
          className="form-control"
          id="profilePic"
          onChange={handleProfilePicChange}
        />
      </div>

      <button type="submit" className="btn btn-primary">Submit</button>
    </form>
  );
};

export default UpdateSpeakerProfile;
