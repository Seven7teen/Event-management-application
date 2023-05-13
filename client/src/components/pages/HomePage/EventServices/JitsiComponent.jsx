import React, { useEffect, useState } from 'react';
import firebase from '../../../../firbase';
import LikeButton from './LikeButton';
import RateButton from './RateButton';

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


    useEffect(async () => {
        const reference = props.activeSession.sessionQARef;
        let dataArr = [];
        await reference.onSnapshot((refdoc) => {
            if(refdoc.exists) {
                setQueryArray(refdoc.data().listQA);
            }
        });
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
                // overwrite interface properties
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
                replies: []
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
                person: props.user.displayName
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

    return (
        <>
            <header className="nav-bar">
                <p className="item-left heading">{props.activeSession ? 'Live Session'  : 'No Live Session'}</p>
            </header>
                <div id="jitsi-iframe" style={{width: '900px'}}></div>
            <div class="item-center">
                <div>
                    <LikeButton activeSession={props.activeSession} globalEventId={props.globalEventId} />
                    <RateButton activeSession={props.activeSession} globalEventId={props.globalEventId} />
                </div>
                <div className='session-event'>
                    <div className="session-day">
                        <div className='imgH3'>
                            <h3>{props.activeSession.timeStart} - {props.activeSession.timeEnd}</h3>
                            <img src='/images/conference.png' alt='imggg'/>
                            <p>{props.activeSession.location ? props.activeSession.location : 'null'}</p>
                            <p>{props.activeSession.tracks ? props.activeSession.tracks : 'null'}</p>
                        </div>
                        <div className="session-events">
                            <div className="session-event">
                                <h4>{props.activeSession.sessionTitle ? props.activeSession.sessionTitle : 'null'}</h4>
                                <p>{props.activeSession.description ? props.activeSession.description : 'null'}</p>
                                <p>{props.activeSession.authors ? props.activeSession.authors : 'null'}</p>
                            </div>
                            <div className="session-buttons">
                                
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                <input type="text" name='query' onChange={(e) => setQueryText(e.target.value)} value={queryText}/>
                <button type="button" className="btn btn-light" onClick={() => handleQuerySend()}>Send</button>
                    
                </div>

                <div>

                    {queryArray.map((item,index) => {
                        return (
                            <div>
                                <div>{item.query}</div>
                                <div>{item.queryAsker}</div>
                                <div>
                                {
                                    item.replies.map((x,ind) => {
                                        return (<div>
                                            <div>{x.replyText}</div>
                                            <div>{x.person}</div>
                                            <br />
                                        </div>)
                                    })
                                }
                                </div>
                                <br />
                                <input type="text" name='reply' onChange={(e) => setText(e.target.value)}/>
                                <button type="button" className="btn btn-light" onClick={() => handleSend(index)}>Send</button>
                            </div>
                        )
                    })}

                </div>

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


