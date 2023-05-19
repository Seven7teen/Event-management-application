import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import Dialog from '@material-ui/core/Dialog';
import DialogActions from '@material-ui/core/DialogActions';
import DialogContent from '@material-ui/core/DialogContent';
import DialogTitle from '@material-ui/core/DialogTitle';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';
import firebase from '../../../../firbase';
import { useAuth } from '../../../Auth/AuthContext';

const db = firebase.firestore();

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '100%',
    },
  },
}));

const formatTime = (time) => {
    const date = new Date();
    const [hours, minutes] = time.split(':');
    date.setHours(hours, minutes);

    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };


function AddSession(props) {
    
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

    const {currentUser} = useAuth();

    const handleClose = () => {
        props.setOpen(false);
        clear();
    };

    function generateRandomString(size) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < size; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        
        return result;
      }

      function generateRandomString(size) {
        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        let result = '';
        
        for (let i = 0; i < size; i++) {
          const randomIndex = Math.floor(Math.random() * characters.length);
          result += characters[randomIndex];
        }
        
        return result;
      }


    const handleSubmit = async () => {
        if(sessionTitle=="")
        {
            alert("Session title can't be Empty!");
        }
        else
        {
            let sessionImageUrl = "images/other.jpg";
            if(sessionImage !== null) {

                const storageRef = firebase.storage().ref();
                const sessionImageRef = storageRef.child(sessionImage.name);
                await sessionImageRef.put(sessionImage);

                sessionImageUrl = await sessionImageRef.getDownloadURL();
                

            }

            const randomString = generateRandomString(5);

            let sess = {
                // id: uniqid(),
                sessionId: `meetSession${randomString}`,
                authors: authors,
                activeParticipants: 0,
                date: date,
                description: description,
                location: location,
                sessionLikes: [],
                sessionQARef: db.collection("globalEvents").doc(props.globalEventId).collection("sessionQA").doc(sessionTitle.substring(0,20) + props.sessionArrayLength),
                sessionRatings: [],
                sessionRoom: `session${randomString}`,
                sessionTitle: sessionTitle,
                speakers: speakers ? speakers : 'not provided',
                tracks: tracks ? tracks : 'not provided',
                timeEnd: formatTime(timeEnd),
                timeStart: formatTime(timeStart),
                sessionImageUrl: sessionImageUrl
            }

            const docref = db.collection('globalEvents').doc(props.globalEventId);
            await docref.get()
            .then(async (doc) => {
                if(doc.exists) {
                    let arr = [...doc.data().sessions];
                    arr.push(sess);
                    await docref.update({
                        sessions: arr
                    }).then(() => {
                        console.log("Document written successfully");
                        let updatedArr = [...props.editOpenArr];
                        updatedArr.push(false);
                        props.setEditOpenArr(updatedArr);
                    }).catch(err => {
                        console.error("Error: "+err);
                    });
                    props.setOpen(false);
                    clear();
                }
            })
        }
    } 

    const clear = () => {
        setSessionTitle("");
        setAuthors("");
        setDate("");
        setDescription("");
        setLocation("");
        setSessionImage(null);
        setSpeakers("");
        setTimeEnd("");
        setTimeStart("");
        setTracks("");
    }

    const descriptionElementRef = React.useRef(null);
    React.useEffect(() => {
        if (props.open) {
        const { current: descriptionElement } = descriptionElementRef;
        if (descriptionElement !== null) {
            descriptionElement.focus();
        }
        }
    }, [props.open]);

    function handleChange(e){
        // console.log(e.target.id);
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
      };

    return (
        <div>
            <Dialog
            open={props.open}
            onClose={handleClose}
            // scroll={props.scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            >
            <DialogTitle id="scroll-dialog-title">Add Session</DialogTitle>
            <DialogContent >
                <form className={classes.root}>
                    <label htmlFor='sessionTitle'>Title: </label>
                    <TextField required id="sessionTitle" placeholder="sessionTitle" value={sessionTitle} onChange={(e) => handleChange(e)}/>
                    <label htmlFor='authors'>Authors: </label>
                    <TextField required id="authors" placeholder="authors" value={authors} onChange={(e) => handleChange(e)}/>
                    <label for="date">Date:</label>
                    <input type="date" id="date" name="trip-date"
                        min="2022-01-01" max="2023-12-31" value={date}  onChange={(e) => handleChange(e)}/>
                    <label htmlFor='description'>Description: </label>
                    <TextField
                        id="description"
                        placeholder="Description(max 1000 char)"
                        multiline
                        value={description}
                        onChange={(e) => handleChange(e) }
                        inputProps={{maxLength: 1000}}
                        fullWidth
                    />
                    <label htmlFor='location'>Location: </label>
                    <TextField required id="location" placeholder="location" value={location} onChange={(e) => handleChange(e)}/>
                    
                    
                    <label htmlFor='speakers'>Speakers: </label>
                    <TextField required id="speakers" placeholder="speakers (separated by comma)" value={speakers} onChange={(e) => handleChange(e)}/>
                    <label for="timeStart">Start Time:</label>
                    <input
                        type="time"
                        id="timeStart"
                        value={timeStart}
                        onChange={(e) => handleChange(e)}
                    />
                    <label for="timeEnd">End Time:</label>
                     <input
                        type="time"
                        id="timeEnd"
                        value={timeEnd}
                        onChange={(e) => handleChange(e)}
                    />
                    <label htmlFor='tracks'>Tracks: </label>
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

export default AddSession;