import React, { useState, useEffect } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';
import { rangeRight } from 'lodash';


const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));


function convertToInputTimeFormat(timeString) {
    const [time, period] = timeString.split(' ');
    // console.log("time: " + time +" period: " + period);
    let [hours, minutes] = time.split(':').map(Number);
    // console.log("hours: " + hours +" minutes: " + minutes);
  
    if (period === 'PM' && hours !== 12) {
      hours += 12;
    } else if (period === 'AM' && hours === 12) {
      hours = 0;
    }
  
    const formattedTime = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}`;
    // console.log(formattedTime)
    return formattedTime;
  }


  const formatTime = (time) => {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

function EditSession(props) {
    
    const classes = useStyles();
    const [sessionTitle, setSessionTitle] = useState("");
    const [timeEnd, setTimeEnd] = useState();
    const [timeStart, setTimeStart] = useState();
    const [speakers, setSpeakers] = useState("");
    const [tracks, setTracks] = useState("");
    const [authors, setAuthors] = useState("");
    const [date, setDate] = useState("");
    const [location, setLocation] = useState("");
    const [description, setDescription] = useState("");
    const [sessionImage, setSessionImage] = useState(null);
    const [sessionIndex, setSessionIndex] = useState();
    const [picUrl, setPicUrl] = useState("");

    useEffect(async () => {
        console.log(props.open);
        const docref = db.collection("globalEvents").doc(props.globalEventId);
        await docref.onSnapshot((doc) => {
            if(doc.exists) {
                // console.log("docsss found");
                const data = [...doc.data().sessions];
                const index = data.findIndex(obj => obj.sessionId === props.element.sessionId);
                console.log(props.open);
                setSessionIndex(index);
                const endTiming = convertToInputTimeFormat(data[index].timeEnd);
                const startTiming = convertToInputTimeFormat(data[index].timeStart);
                setSessionTitle(data[index].sessionTitle);
                setAuthors(data[index].authors);
                setDate(data[index].date);
                setDescription(data[index].description);
                setLocation(data[index].location);
                // setSessionImage(null);
                setSpeakers(data[index].speakers);
                setTimeEnd(endTiming);
                setTimeStart(startTiming);
                setTracks(data[index].tracks);
                setPicUrl(data[index].sessionImageUrl);
            } else {
                console.log("doc not found");
            }
        })

    },[]);

    const handleClose = () => {
        let updatedArr = [...props.open];
        updatedArr[sessionIndex] = false;
        props.setOpen(updatedArr);
        console.log(updatedArr);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if(sessionTitle=="")
        {
            alert("Event title can't be Empty!");
        }
        else
        {
            let sessionImageUrl = "images/conference.png";
            let updatedArr = [];
            if(sessionImage) {

                const storageRef = firebase.storage().ref();
                const sessionImageRef = storageRef.child(sessionImage.name);
                await sessionImageRef.put(sessionImage);

                sessionImageUrl = await sessionImageRef.getDownloadURL();
                // console.log(sessionImageUrl);
            }

            // let sess = {
            //     authors: authors,
            //     date: date,
            //     description: description,
            //     location: location,
            //     sessionTitle: sessionTitle,
            //     speakers: speakers ? speakers : 'not provided',
            //     tracks: tracks ? tracks : 'not provided',
            //     timeEnd: formatTime(timeEnd),
            //     timeStart: formatTime(timeStart),
            //     sessionImageUrl: sessionImageUrl
            // }
     
            const docref =  db.collection('globalEvents').doc(props.globalEventId);
            await docref.get().then((doc) => {
                let arr = [...doc.data().sessions];
                
                updatedArr = arr.map(obj => {
                    if (obj.sessionId === props.element.sessionId) {
                      return { ...obj, 
                        authors: authors,
                        date: date,
                        description: description,
                        location: location,
                        sessionTitle: sessionTitle,
                        speakers: speakers ? speakers : 'not provided',
                        tracks: tracks ? tracks : 'not provided',
                        timeEnd: formatTime(timeEnd),
                        timeStart: formatTime(timeStart),
                        sessionImageUrl: sessionImageUrl };
                    }
                    return obj;
                  });                  

            });
            await docref.update({
               sessions: updatedArr
            }).then(() => {
                console.log('Document updated successfully');
                let updatedArr = [...props.open];
                updatedArr[sessionIndex] = false;
                props.setOpen(updatedArr);
                console.log(updatedArr);
              })
              .catch((error) => {
                console.error('Error updating document:', error);
              });
        }
    } 

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (props.open[sessionIndex]) {
            const { current: descriptionElement } = descriptionElementRef;
            if (descriptionElement !== null) {
                descriptionElement.focus();
            }
        }
    }, []);

    function handleChange(e){
        let id = e.target.id;
        let val = e.target.value;

        
        if(id==='sessionTitle') setSessionTitle(val);
        if(id==='authors') setAuthors(val);
        if(id==='date') setDate(val);
        if(id==='description') setDescription(val);
        if(id==='location') setLocation(val);
        if(id==='speakers') setSpeakers(val);
        if(id==='timeEnd') setTimeEnd(val);
        if(id==='timeStart') setTimeStart(val);
        if(id==='tracks') setTracks(val);
            
    }

    const handleSessionImageChange = (e) => {
        const file = e.target.files[0];
        setSessionImage(file);
        setPicUrl(URL.createObjectURL(file));
      };

    return (
        <div>
            <Dialog
            open={props.open[sessionIndex]}
            onClose={handleClose}
            // scroll={props.scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            >
            <DialogTitle id="scroll-dialog-title">Edit Session</DialogTitle>
            <DialogContent>
                <form className={classes.root}>
                <div><img style={{margin: "0 140px"}} src={picUrl} alt="imgggg" /></div>
                    {/* <img src={picUrl} alt="imgggg" /> */}
                    <label htmlFor="sessionTitle">Title:</label>
                    <TextField required id="sessionTitle" placeholder="sessionTitle" value={sessionTitle} onChange={(e) => handleChange(e)}/>
                    <label htmlFor="authors">Authors:</label>
                    <TextField required id="authors" placeholder="authors" value={authors} onChange={(e) => handleChange(e)}/>
                    <label htmlFor="date">Date:</label>
                    <input type="date" id="date" name="trip-date"
                        min="2022-01-01" max="2023-12-31" value={date}  onChange={(e) => handleChange(e)}/>
                    <label htmlFor="description">Description:</label>
                    <TextField
                        id="description"
                        placeholder="Description(max 1000 char)"
                        multiline
                        value={description}
                        onChange={(e) => handleChange(e) }
                        inputProps={{maxLength: 1000}}
                        fullWidth
                    />
                    <label htmlFor="location">Location:</label>
                    <TextField required id="location" placeholder="location" value={location} onChange={(e) => handleChange(e)}/>
                    <label htmlFor="speakers">Speakers:</label>
                    <TextField required id="speakers" placeholder="speakers (separated with comma)" value={speakers} onChange={(e) => handleChange(e)}/>
                    <label htmlFor="timeStart">Start Time:</label>
                    <input
                        type="time"
                        id="timeStart"
                        value={timeStart}
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor="timeEnd">End Time:</label>
                     <input
                        type="time"
                        id="timeEnd"
                        value={timeEnd}
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor="tracks">Tracks:</label>
                    <TextField required id="tracks" placeholder="tracks" value={tracks} onChange={(e) => handleChange(e)}/>
                    <label htmlFor="sessionImage" className="form-label">Session Picture:</label>
                        <input
                        type="file"
                        className="form-control"
                        id="sessionImage"
                        onChange={handleSessionImageChange}
                        />
                </form>
            </DialogContent>
            <DialogActions>
            <Button onClick={handleClose} color="primary">
                Cancel
            </Button>
            <Button onClick={handleSubmit} color="primary">
                Save
            </Button>
            </DialogActions>
        </Dialog>
        </div>
    );
}

export default EditSession;