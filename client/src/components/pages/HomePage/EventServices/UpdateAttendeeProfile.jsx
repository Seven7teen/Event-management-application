import React, { useState, useEffect } from 'react';
import firebase from "../../../../firbase";
import { useAuth } from '../../../Auth/AuthContext';

const db = firebase.firestore();

const UpdateAttendeeProfile = (props) => {
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
        <label htmlFor="attendeeName" className="form-label">Attendee Name:</label>
        <input
          type="text"
          className="form-control"
          id="attendeeName"
          value={attendeeName}
          onChange={(e) => setAttendeeName(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="organization" className="form-label">Organization:</label>
        <input
          type="text"
          className="form-control"
          id="organization"
          value={organization}
          onChange={(e) => setOrganization(e.target.value)}
        />
      </div>

      <div className="mb-3">
        <label htmlFor="profession" className="form-label">Profession:</label>
        <input
          type="text"
          className="form-control"
          id="profession"
          value={profession}
          onChange={(e) => setProfesssion(e.target.value)}
        />
      </div>

      <div className='mb-3'>
          <label for="bio">Example textarea</label>
          <textarea className="form-control" id="bio" rows="3" value={bio}  onChange={(e) => setBio(e.target.value)}/>
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

      <button type="submit" className="btn btn-primary">Register</button>
    </form>
  );
};

export default UpdateAttendeeProfile;
