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
      width: '25ch',
    },
  },
}));


function AddGlobalEvent(props) {
    
    const classes = useStyles();
    const [title,setTitle] = useState("");
    const [desc,setDesc] = useState("");
    const {currentUser} = useAuth();
    const [agenda,setAgenda] = useState([]);
    // const [users, setUsers] = useState([]);
    const [startDate, setStartDate] = useState("");
    const [endDate, setEndDate] = useState("");
    const [eventPicture, setEventPicture] = useState(null);

    const handleClose = () => {
        props.setOpen(false);
        clear();
    };

    const handleSubmit = async () => {
        if(title=="")
        {
            alert("Event title can't be Empty!");
        }
        else
        {
            let eventPictureUrl = "images/other.jpg";
            if(eventPicture !== null) {

                const storageRef = firebase.storage().ref();
                const eventPictureRef = storageRef.child(eventPicture.name);
                await eventPictureRef.put(eventPicture);

                eventPictureUrl = await eventPictureRef.getDownloadURL();

            }

            let eve = {
                // id: uniqid(),
                globalEventName: title,
                globalEventDescription: desc,
                startDate: startDate,
                endDate: endDate,
                attendees: [],
                speakers: [],
                sessions: [],
                globalEventId: "",
                globalEvent: "",
                eventPictureUrl: eventPictureUrl
            }

            await db.collection('globalEvents').add({
                ...eve,
            }).then(async docRef => {
                await db.collection('globalEvents').doc(docRef.id).update({
                    globalEventId: docRef.id,
                    globalEvent: docRef.id
                });
                props.setOpen(false);
                clear();
            })
        }
    } 

    const clear = () => {
        setTitle("");
        setDesc("");
        setStartDate("");
        setEndDate("");
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

        // console.log(val);
        if(id==='standard-basic title')
            setTitle(val);
        if(id==='standard-basic description') {
            setDesc(val);
        }
        if(id === 'start') {
            setStartDate(val);
        }
        if(id === 'end') {
            setEndDate(val);
        }
            
    }

    const handleEventPictureChange = (e) => {
        const file = e.target.files[0];
        setEventPicture(file);
      };

    return (
        <div>
            <Dialog
            open={props.open}
            onClose={handleClose}
            scroll={props.scroll}
            aria-labelledby="scroll-dialog-title"
            aria-describedby="scroll-dialog-description"
            >
            <DialogTitle id="scroll-dialog-title">Add Event</DialogTitle>
            <DialogContent dividers={props.scroll === 'paper'}>
                <form className={classes.root}>
                    <TextField required id="standard-basic title" placeholder="Title" value={title} onChange={(e) => handleChange(e)}/>
                    <TextField
                        id="standard-basic description"
                        placeholder="Description(max 1000 char)"
                        multiline
                        // rows={4}
                        // variant="outlined"
                        value={desc}
                        onChange={(e) => handleChange(e) }
                        inputProps={{maxLength: 1000}}
                        fullWidth
                        // style={{margin: "2% 0"}}
                    />
                    <label for="start">Start date:</label>
                    <input type="date" id="start" name="trip-start"
                        min="2023-01-01" max="2023-12-31" value={startDate}  onChange={(e) => handleChange(e)}/>
                    <label for="end">End date:</label>
                    <input type="date" id="end" name="trip-end" value={endDate}
                        min="2023-01-01" max="2023-12-31" onChange={(e) => handleChange(e)} />
                    <label htmlFor="eventPicture" className="form-label">Event Picture:</label>
                        <input
                        type="file"
                        className="form-control"
                        id="eventPicture"
                        onChange={handleEventPictureChange}
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

export default AddGlobalEvent;