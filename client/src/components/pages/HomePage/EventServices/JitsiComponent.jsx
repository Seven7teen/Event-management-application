import React, { useEffect, useState } from 'react';
import firebase from '../../../../firbase';
import LikeButton from './LikeButton';
import RateButton from './RateButton';
import { MdQuestionAnswer } from "react-icons/md";
import "./JitsiComponent.css";

import { useAuth } from '../../../Auth/AuthContext';

const db = firebase.firestore();


const JitsiComponent = (props) => {
    const domain = 'meet.jit.si';
    let api = {};

    // const [room,setRoom] = useState('random');
    // const [user, setUser] = useState({
    //     name: 'taj'
    // });
    const [isAudioMuted, setIsAudioMuted] = useState(false);
    const [isVideoMuted, setIsVideoMuted] = useState(false);
    const [queryArray, setQueryArray] = useState([]);
    const [text, setText] = useState();
    const [queryText, setQueryText] = useState();
    const [imageUrl, SetImageUrl] = useState("");
    const {currentUser} = useAuth();
    const [bioExtend, setBioExtend] = useState({
        index: 0,
        check: false
    });
    const [allQuestion, setAllQuestions] = useState(false);
    const [queryArrayLen, setQueryArrayLen] = useState(2);

    const handleExtend = (param) => {
        setBioExtend({
            index: param,
            check: true
        });
    }


    useEffect(async () => {
        const reference = props.activeSession.sessionQARef;
        let dataArr = [];
        await reference.onSnapshot((refdoc) => {
            if(refdoc.exists) {
                setQueryArray(refdoc.data().listQA);
                let arr = [...refdoc.data().listQA];
                if(arr.length <= 2) {
                    console.log("6 array length");
                    setQueryArrayLen(refdoc.data().listQA.length);
                } else {
                    console.log("3 array length");
                    setQueryArrayLen(3);
                }
            }
        });
    },[]);

    useEffect(async () => {
        await db.collection("users").doc(currentUser.uid).get().then((doc) => {
            if(doc.exists) {
                const imgurl = doc.data().photoURL;
                SetImageUrl(imgurl);
            }
        })
    },[]);


    useEffect(() => {
        if (window.JitsiMeetExternalAPI) {
            startMeet(props.roomName, props.user.displayName);
        } else {
            alert('JitsiMeetExternalAPI not loaded');
        }
    },[]);

    const startMeet = (room, name) => {
        const options = {
            roomName: room,
            width: '100%',
            height: 500,
            configOverwrite: { prejoinPageEnabled: false },
            interfaceConfigOverwrite: {
            },
            parentNode: document.querySelector('#jitsi-iframe'),
            userInfo: {
                displayName: name
            }
        }
        api = new window.JitsiMeetExternalAPI(domain, options);

        api.addEventListeners({
            readyToClose: handleClose,
            participantLeft: handleParticipantLeft,
            participantJoined: handleParticipantJoined,
            videoConferenceJoined: handleVideoConferenceJoined,
            videoConferenceLeft: handleVideoConferenceLeft,
            audioMuteStatusChanged: handleMuteStatus,
            videoMuteStatusChanged: handleVideoStatus
        });
    }
    
    const handleClose = () => {
        console.log("handleClose");
    }

    const handleParticipantLeft = async (participant) => {
        console.log("handleParticipantLeft", participant); // { id: "2baa184e" }
        const data = await getParticipants();
        props.onChildClick(data.length);
    }

    const handleParticipantJoined = async (participant) => {
        console.log("handleParticipantJoined", participant); // { id: "2baa184e", displayName: "Shanu Verma", formattedDisplayName: "Shanu Verma" }
        const data = await getParticipants();
        props.onChildClick(data.length);
    }

    const handleVideoConferenceJoined = async (participant) => {
        console.log("handleVideoConferenceJoined", participant); // { roomName: "bwb-bfqi-vmh", id: "8c35a951", displayName: "Akash Verma", formattedDisplayName: "Akash Verma (me)"}
        const data = await getParticipants();
        props.onChildClick(data.length);
    }

    const handleVideoConferenceLeft = async () => {
        console.log("handleVideoConferenceLeft");
        const data = await getParticipants();
        props.onChildClick(data.length);
        // return props.history.push('/thank-you');
    }

    const handleMuteStatus = (audio) => {
        console.log("handleMuteStatus", audio); // { muted: true }
    }

    const handleVideoStatus = (video) => {
        console.log("handleVideoStatus", video); // { muted: true }
    }

    const getParticipants = () => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(api.getParticipantsInfo()); // get all participants
            }, 500)
        });
    }

    // custom events
    const executeCommand = (command) => {
        api.executeCommand(command);;
        if(command == 'hangup') {
            return props.history.push('/thank-you');
        }

        if(command == 'toggleAudio') {
            setIsAudioMuted(!isAudioMuted);
        }

        if(command == 'toggleVideo') {
            setIsVideoMuted(!isVideoMuted);
        }
    }

    const handleQuerySend = async () => {
        const reference = props.activeSession.sessionQARef; 
        await reference.get().then((docref) => {
            let arr = [];
            if(docref.exists) {
                arr = [...docref.data().listQA];
            }
            arr.push({
                query: queryText,
                queryAsker: props.user.displayName,
                replies: [],
                querySenderImage: imageUrl,
                createdAt:new Date()
            })

            reference.set({listQA: arr}, {merge: true})
                .then(() => {
                    console.log('Document updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating document:', error);
                });
            setQueryText("");
        })
    }

    const handleSend = async (index) => {
        const reference = props.activeSession.sessionQARef
        await reference.get().then(async (docref) => {
            const arr = [...docref.data().listQA];
            const replyArr = [...arr[index].replies];
            replyArr.push({
                replyText: text,
                person: props.user.displayName,
                replyImageUrl: imageUrl,
                createdAt: new Date()
            });
            const updatedObject = {...arr[index], replies: replyArr};
            arr[index] = updatedObject;

            await reference.set({listQA: arr}, {merge: true})
                .then(() => {
                    console.log('Document updated successfully');
                })
                .catch((error) => {
                    console.error('Error updating document:', error);
                });
        })
    }

    function formatTimeAgo(timestampObject) {
        // console.log(timestampObject);
        let timestamp;
        if(!timestampObject) {
            return "";
        } else {
            // timestamp = timestampObject;
            const milliseconds = timestampObject.seconds * 1000 + timestampObject.nanoseconds / 1000000;
            timestamp = new Date(milliseconds);
            // console.log(timestamp);
        }
        const currentDate = new Date();
        const previousDate = timestamp;
        console.log(currentDate + " current " + previousDate + " previousDate");
      
        const timeDifference = currentDate.getTime() - previousDate.getTime();
        const millisecondsPerSecond = 1000;
        const millisecondsPerMinute = 60 * millisecondsPerSecond;
        const millisecondsPerHour = 60 * millisecondsPerMinute;
        const millisecondsPerDay = 24 * millisecondsPerHour;
        const millisecondsPerWeek = 7 * millisecondsPerDay;
      
        if (timeDifference < millisecondsPerMinute) {
          return "Just now";
        } else if (timeDifference < millisecondsPerHour) {
          const minutes = Math.floor(timeDifference / millisecondsPerMinute);
          return `${minutes} ${minutes === 1 ? "minute" : "minutes"} ago`;
        } else if (timeDifference < millisecondsPerDay) {
          const hours = Math.floor(timeDifference / millisecondsPerHour);
          return `${hours} ${hours === 1 ? "hour" : "hours"} ago`;
        } else if (timeDifference < millisecondsPerWeek) {
          const days = Math.floor(timeDifference / millisecondsPerDay);
          return `${days} ${days === 1 ? "day" : "days"} ago`;
        } else {
          const weeks = Math.floor(timeDifference / millisecondsPerWeek);
          return `${weeks} ${weeks === 1 ? "week" : "weeks"} ago`;
        }
      }
      

    return (
        <>
            <header className="nav-bar">
                <p className="item-left heading">{props.activeSession ? 'Live Session'  : 'Not Available'}</p>
            </header>
                <div id="jitsi-iframe" style={{width: '1100px', marginLeft: "14px"}}></div>
            <div class="item-center">
                <div style={{width: '900px', display: "flex", justifyContent: "flex-end"}}>
                    <LikeButton activeSession={props.activeSession} globalEventId={props.globalEventId} />
                    <div style={{width: "40px"}}></div>
                    <RateButton activeSession={props.activeSession} globalEventId={props.globalEventId} />
                </div>
                <div className='session-event'>
                    <div className="session-day">
                        <div style={{padding: "1rem"}}>
                            <img src='/images/conference.png' alt='imggg'/>
                        </div>
                        <div className="session-events">
                            <div className="session-event">
                            <h4>{props.activeSession.sessionTitle ? props.activeSession.sessionTitle : 'null'}</h4>
                            <p><span style={{color: "black", fontWeight:"bold"}}>Description: </span> {props.activeSession.description ? props.activeSession.description : 'null'}</p>
                                <p><span style={{color: "black", fontWeight:"bold"}}>Duration: </span> {props.activeSession.timeStart} - {props.activeSession.timeEnd}</p>
                                <p><span style={{color: "black", fontWeight:"bold"}}>Authors: </span> {props.activeSession.authors ? props.activeSession.authors : 'null'}</p>
                                <p><span style={{color: "black", fontWeight:"bold"}}>Location: </span> {props.activeSession.location ? props.activeSession.location : 'null'}</p>
                                <p><span style={{color: "black", fontWeight:"bold"}}>Tracks: </span> {props.activeSession.tracks ? props.activeSession.tracks : 'null'}</p>
                            </div>
                            <div className="session-buttons">
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div style={{padding: "20px 0 5px 0", fontWeight: "bold"}}>Ask a new question</div>
                <div class="input-group mb-3">
                    <input type="text" class="form-control" placeholder="Query Text" aria-label="Recipient's username" aria-describedby="basic-addon2" onChange={(e) => setQueryText(e.target.value)} value={queryText} />
                    <div class="input-group-append">
                        <button class="btn btn-success" type="button" onClick={() => handleQuerySend()}>Send</button>
                    </div>
                </div>

                <div style={{fontWeight: "bold"}}>Featured questions in this course ( {queryArray.length} )</div>


                {

                allQuestion === false ? (<>

                    {queryArray.slice(0,queryArrayLen).map((item,index) => {
                        let qTime = "";
                        if(item.createdAt) {
                            // console.log(item.createdAt);
                            qTime = formatTimeAgo(item.createdAt);
                        }
                        // console.log(qTime);
                        return (
                            <div class="query">
                            <div class="author">
                                <img class="country-flag img-fluid" src={item.querySenderImage}/>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div class="authorName">{item.queryAsker}</div>
                                    <div className='createdAtTheme'>{qTime}</div>
                                </div>
                            </div>

                            {
                                (bioExtend.check === true && bioExtend.index === index) ? (
                                    <>
                                    <div class="message queryItem">{item.query}</div>
                                    
                                    <div class="replies">
                                    <div style={{padding: "20px 0 5px 0", fontWeight: "bold"}}> {item.replies.length} Replies</div>

                            {       
                                    item.replies.map((x,ind) => {
                                        let fmtTime = formatTimeAgo(x.createdAt);
                                        return (<div class="reply">
                                        <div class="author">
                                            <img class="country-flag img-fluid" src={x.replyImageUrl} />
                                            
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <div class="authorName">{x.person}</div>
                                                <div className='createdAtTheme'>{fmtTime}</div>
                                            </div>
                                        </div>
                                        <div class="message">{x.replyText}</div>
                                    </div>)
                                    })
                                }

                                <div class="input-group mb-3">
                                    <input type="text" class="form-control replyText" placeholder="Reply" aria-label="Recipient's username" aria-describedby="basic-addon2"  onChange={(e) => setText(e.target.value)} />
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button" onClick={() => handleSend(index)}>Send</button>
                                    </div>
                                </div>

                            </div>

                            <br />
                                
                                    </>   
                                ) : (
                                    <>
                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div class="message">{item.query.substring(0, 100) + " ..."} </div>
                                        <div><MdQuestionAnswer style={{fontSize: "1.5rem", color: "black"}} onClick={() => handleExtend(index)} /> ({item.replies.length})</div>
                                    </div>
                            <br /> 
                                    </>
                                )
                            }      
                            </div>
                        )
                    })
                }

                <button type='button' className='btn btn-secondary btn-block' onClick={() => setAllQuestions(true)}>See all questions</button>

                </>) : (<>

                    {
                    queryArray.map((item,index) => {
                        let qTime = "";
                        if(item.createdAt) {
                            // console.log(item.createdAt);
                            qTime = formatTimeAgo(item.createdAt);
                        }
                        // console.log(qTime);
                        return (
                            <div class="query">
                            <div class="author">
                                <img class="country-flag img-fluid" src={item.querySenderImage}/>
                                <div style={{display: "flex", flexDirection: "column"}}>
                                    <div class="authorName">{item.queryAsker}</div>
                                    <div className='createdAtTheme'>{qTime}</div>
                                </div>
                            </div>

                            {
                                (bioExtend.check === true && bioExtend.index === index) ? (
                                    <>
                                    <div class="message queryItem">{item.query}</div>
                                    
                                    <div class="replies">
                                    <div style={{padding: "20px 0 5px 0", fontWeight: "bold"}}> {item.replies.length} Replies</div>

                            {       
                                    item.replies.map((x,ind) => {
                                        let fmtTime = formatTimeAgo(x.createdAt);
                                        return (<div class="reply">
                                        <div class="author">
                                            <img class="country-flag img-fluid" src={x.replyImageUrl} />
                                            
                                            <div style={{display: "flex", flexDirection: "column"}}>
                                                <div class="authorName">{x.person}</div>
                                                <div className='createdAtTheme'>{fmtTime}</div>
                                            </div>
                                        </div>
                                        <div class="message">{x.replyText}</div>
                                    </div>)
                                    })
                                }

                                <div class="input-group mb-3">
                                    <input type="text" class="form-control replyText" placeholder="Reply" aria-label="Recipient's username" aria-describedby="basic-addon2"  onChange={(e) => setText(e.target.value)} />
                                    <div class="input-group-append">
                                        <button class="btn btn-primary" type="button" onClick={() => handleSend(index)}>Send</button>
                                    </div>
                                </div>

                            </div>

                            <br />
                                
                                    </>   
                                ) : (
                                    <>

                                    <div style={{display: "flex", justifyContent: "space-between"}}>
                                        <div class="message">{item.query.substring(0, 100) + " ..."} </div>
                                        <div><MdQuestionAnswer style={{fontSize: "1.5rem", color: "black"}} onClick={() => handleExtend(index)} /> ({item.replies.length})</div>
                                    </div>

                                    {/* <div class="message">{item.query.substring(0, 300) + " ..."} <span style={{ marginLeft: "200px"}}><MdQuestionAnswer style={{fontSize: "1.5rem", color: "black"}} onClick={() => handleExtend(index)} /> ({item.replies.length})</span> */}

                            {/* </div> */}

                            <br /> 
                                    </>
                                )
                            }      
                            </div>
                        )
                    })
                }
                
                
                
                
                
                
                </>)
}

            </div>
            <div class="item-center">
                <span>&nbsp;&nbsp;</span>
                <i onClick={ () => executeCommand('toggleAudio') } className={`fas fa-2x grey-color ${isAudioMuted ? 'fa-microphone-slash' : 'fa-microphone'}`} aria-hidden="true" title="Mute / Unmute"></i>
                <i onClick={ () => executeCommand('hangup') } className="fas fa-phone-slash fa-2x red-color" aria-hidden="true" title="Leave"></i>
                <i onClick={ () => executeCommand('toggleVideo') } className={`fas fa-2x grey-color ${isVideoMuted ? 'fa-video-slash' : 'fa-video'}`} aria-hidden="true" title="Start / Stop camera"></i>
                <i onClick={ () => executeCommand('toggleShareScreen') } className="fas fa-film fa-2x grey-color" aria-hidden="true" title="Share your screen"></i>
            </div>

            </>

    );

}

export default JitsiComponent;


