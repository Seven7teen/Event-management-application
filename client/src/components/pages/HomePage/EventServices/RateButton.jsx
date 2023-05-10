import React, { useEffect, useState } from 'react';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import { has } from 'lodash';

const db = firebase.firestore();

const RateButton = (props) => {
  const [rating, setRating] = useState(0);
  const [avgRating, setAvgRating] = useState(0);
  const {currentUser} = useAuth();

  useEffect(() => {
    const fetchItemData = async () => {
      const itemRef = db.collection('globalEvents').doc(props.globalEventId);
      const itemData = await itemRef.get();
      if (itemData.exists) {
        const sessionItems = itemData.data().sessions;
        sessionItems.map((item,index) => {
            if(item.sessionTitle === props.activeSession.sessionTitle) {
                let ratingCalculator = 0.0;
                if(item.sessionRatings.length !== 0) {
                  item.sessionRatings.map((item2,index2) => {
                    ratingCalculator += item2.rating;
                    if(item2.userId === currentUser.uid) {
                      const dataOb = item2.rating;
                      setRating(dataOb);
                    }
                  })
                  setAvgRating(ratingCalculator/item.sessionRatings.length);
                }
            }
        });
      }
    };

    fetchItemData();

  },[rating]);

  const handleRatingChange = async (event) => {
    const selectedRating = parseInt(event.target.value);
    const newObj = {
      userId: currentUser.uid,
      rating: selectedRating
    };


    const docref = db.collection('globalEvents').doc(props.globalEventId);
        await docref.get().
        then((doc) => {
          if(doc.exists) {
            let newArrField = [...doc.data().sessions];
            console.log(newArrField);
            
            newArrField.map((item, index) => {
              if(item.sessionTitle === props.activeSession.sessionTitle) {

                const sessionLikeLocalArr = [...item.sessionRatings];
                console.log(sessionLikeLocalArr);
                
                const hasObjectWithUserIdIndex = sessionLikeLocalArr.findIndex((obj) => obj.userId === currentUser.uid);
                
                if(hasObjectWithUserIdIndex === -1) {
                    sessionLikeLocalArr.push(newObj);
                } else {
                  sessionLikeLocalArr[hasObjectWithUserIdIndex] = newObj;
                }

                const updatedObject = {...newArrField[index], sessionRatings: sessionLikeLocalArr}
                newArrField[index] = updatedObject;

                docref.set({sessions: newArrField}, {merge: true})
                .then(() => {
                    console.log('Document updated successfully');
                    setRating(selectedRating);
                })
                .catch((error) => {
                    console.error('Error updating document:', error);
                });

              }
            });
          } else {
            console.log("Doc not found");
          }
        })


  };

  return (
    <div>
      <div>{avgRating}</div>
      <label>
        Rate this item:
        <select value={rating} onChange={handleRatingChange}>
          <option value={0}>Select Rating</option>
          <option value={1}>1 Star</option>
          <option value={2}>2 Stars</option>
          <option value={3}>3 Stars</option>
          <option value={4}>4 Stars</option>
          <option value={5}>5 Stars</option>
        </select>
      </label>
    </div>
  );
};

export default RateButton;
