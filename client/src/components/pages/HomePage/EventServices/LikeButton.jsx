import React, { useState, useEffect } from 'react';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import { AiFillLike, AiOutlineLike } from "react-icons/ai";

const db = firebase.firestore();



const LikeButton = (props) => {
  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const {currentUser} = useAuth();

  useEffect(() => {
    const fetchItemData = async () => {
      const itemRef = db.collection('globalEvents').doc(props.globalEventId);
      const itemData = await itemRef.get();
      if (itemData.exists) {
        const sessionItems = itemData.data().sessions;
        sessionItems.map((item,index) => {
            if(item.sessionTitle === props.activeSession.sessionTitle) {
                setLiked(item.sessionLikes.includes(currentUser.uid));
                setLikeCount(item.sessionLikes.length);
            }
        });
      }
    };

    fetchItemData();
  }, []);

  const handleLikeUnlike = async () => {
    const docref = db.collection('globalEvents').doc(props.globalEventId);
        await docref.get().
        then((doc) => {
          if(doc.exists) {
            let newArrField = [...doc.data().sessions];
            console.log(newArrField);
            
            newArrField.map((item, index) => {
              if(item.sessionTitle === props.activeSession.sessionTitle) {

                const sessionLikeLocalArr = [...item.sessionLikes];
                console.log(sessionLikeLocalArr);

                if(liked) {
                    const remIndex = sessionLikeLocalArr.indexOf(currentUser.uid);
                    if(remIndex > -1) {
                        sessionLikeLocalArr.splice(remIndex,1);
                    }
                    const updatedObject = {...newArrField[index], sessionLikes: sessionLikeLocalArr}
                    newArrField[index] = updatedObject;

                    docref.set({sessions: newArrField}, {merge: true})
                    .then(() => {
                        console.log('Document updated successfully');
                        setLiked(false);
                        setLikeCount(likeCount - 1);
                    })
                    .catch((error) => {
                        console.error('Error updating document:', error);
                    });

                }
                else {
                    sessionLikeLocalArr.push(currentUser.uid);
                    const updatedObject = {...newArrField[index], sessionLikes: sessionLikeLocalArr}
                    newArrField[index] = updatedObject;

                    docref.set({sessions: newArrField}, {merge: true})
                    .then(() => {
                        console.log('Document updated successfully');
                        setLiked(true);
                        setLikeCount(likeCount + 1);
                    })
                    .catch((error) => {
                        console.error('Error updating document:', error);
                    });

                }
              }
            });
          } else {
            console.log("Doc not found");
          }
        })
  }
  return (
    <div style={{display: "flex", alignItems: "center"}} >
      <div onClick={handleLikeUnlike}>
      {liked ? <AiFillLike fontSize="25px" color='#F44336' /> : <AiOutlineLike fontSize="25px" />}
      </div>
      <div>{likeCount} {likeCount > 1 ? (<span>Likes</span>) : (<span>Like</span>) }</div>
    </div>
  );
};

export default LikeButton;
