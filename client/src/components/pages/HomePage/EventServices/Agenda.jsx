import React, {useState, useEffect} from "react";
import * as xlsx from 'xlsx';
import './styles.css';
import './speaker-styles.css';
import firebase from '../../../../firbase';
import moment from 'moment';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles((theme) => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
      width: '50%',
    },
  },
}));



const db = firebase.firestore();

const Agenda = (props) => {
    const classes = useStyles();
    const [rawSpeakerData, setRawSpeakerData] = useState([]);
    const [rawAttendeeData, setRawAttendeeData] = useState([]);
    const [rawSessionsData, setRawSessionsData] = useState([]);


    useEffect(() => {
        if(rawSpeakerData.length !== 0) {
            db.collection('globalEvents').doc(props.globalEventId).update({
                speakers: rawSpeakerData
            })
        }
    },[rawSpeakerData]);

    useEffect(() => {
        if(rawAttendeeData.length !== 0) {
            db.collection('globalEvents').doc(props.globalEventId).update({
                attendees: rawAttendeeData
            })
        }
    },[rawAttendeeData]);

    useEffect(() => {
        if(rawSessionsData.length !== 0) {
            console.log(rawSessionsData);
            db.collection('globalEvents').doc(props.globalEventId).update({
                sessions: rawSessionsData
            })
        }
    },[rawSessionsData]);

    const handleAttendeesFile = (e) => {
        const files = e.target.files;
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = xlsx.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const excelData = xlsx.utils.sheet_to_json(ws);
          const agendaData = excelData.map((row) => ({
            attendeeName: row['Attendee Name'],
            attendeeEmail: row['Attendee Email'],
            profession: row['Profession'],
            organization: row['Organization'],
            bio: row['Bio'],
            profilePicURL: '/images/other.jpg' 
        }));
        setRawAttendeeData(agendaData);
    };
    };

    const handleSpeakersFile = (e) => {
        const files = e.target.files;
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = xlsx.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const excelData = xlsx.utils.sheet_to_json(ws);
          const agendaData = excelData.map((row) => ({
            speakerName: row['Name'],
            speakerEmail: row['Email'],
            speakerAffiliation: row['Affiliation'],
            speakerPosition: row['Position'],
            speakerBio: row['Bio'],
            speakerEducation: row['Education'],
            speakerLocation: row['Location'],
            speakerPersonalWebsites: row['Personal Websites'],
            speakerProfilePicURL: '/images/login.png'
        }));
        setRawSpeakerData(agendaData);
    };
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

    const handleSessionsFile = (e) => {
        const files = e.target.files;
        const fileReader = new FileReader();
        fileReader.readAsArrayBuffer(files[0]);
        fileReader.onload = (e) => {
          const bufferArray = e.target.result;
          const wb = xlsx.read(bufferArray, { type: 'buffer' });
          const wsname = wb.SheetNames[0];
          const ws = wb.Sheets[wsname];
          const excelData = xlsx.utils.sheet_to_json(ws);
        //   const randomString = generateRandomString(5);
          const agendaData = excelData.map((row, index) => ({
              sessionId: generateRandomString(5),
              date: row['Date'] ? row['Date']  : 'Not Provided',
              timeStart: row['Time Start'] ? moment().startOf('day').add(row['Time Start'] * 24, 'hours').format("h:mm A")  : 'Not Provided',
              timeEnd: row['Time End'] ? moment().startOf('day').add(row['Time End'] * 24, 'hours').format("h:mm A")  : 'Not Provided',
              tracks: row['Tracks (Optional)'] ? row['Tracks (Optional)']  : 'Not Provided',
              sessionTitle: row['Session Title'] ? row['Session Title']  : 'Not Provided',
              sessionRoom: `session${generateRandomString(5)}`,
              sessionLikes: [],
              sessionRatings: [],
              activeParticipants: 0,
              sessionImageUrl: "/images/conference.png",
              sessionQARef: db.collection("globalEvents").doc(props.globalEventId).collection("sessionQA").doc(row['Session Title'].substring(0,20) + index),
              location: row['Room/Location'] ? row['Room/Location'] : 'Not Provided',
              description: row['Description (Optional)'] ? row['Description (Optional)'] : 'Not Provided',
              speakers: row['Speakers (Optional)'] ? row['Speakers (Optional)']  : 'Not Provided',
              authors: row['Authors (Optional)'] ? row['Authors (Optional)']  : 'Not Provided'
          }));
          setRawSessionsData(agendaData);
        };
      };
    
    return (
        <div className={classes.root} style={{backgroundColor: "#F7F8FA", padding: "1.5rem", boxShadow: "3px 3px 20px rgba(0, 0, 0, 0.2)" }}>
            {/* <div class="form-group">
                <label for="attendees">Attendees File</label>
                <input type="file" class="form-control fileDisplay" id="attendees" onChange={handleAttendeesFile} />
            </div> */}
    
            <label htmlFor="attendees">Attendees File:</label>
            <input
            style={{display: "inline-block"}}
            type="file"
            className="form-control"
            id="attendees"
            onChange={handleAttendeesFile}
            />

            {/* <div class="form-group">
                <label for="speakers">Speakers File</label>
                <input type="file" class="form-control fileDisplay" id="speakers" onChange={handleSpeakersFile} />
            </div> */}

            <label htmlFor="speakers">Speakers File:</label>
            <input
            style={{display: "inline-block"}}
            type="file"
            className="form-control"
            id="speakers"
            onChange={handleSpeakersFile}
            />

            <label htmlFor="sessions">Sessions File:</label>
            <input
            style={{display: "inline-block"}}
            type="file"
            className="form-control"
            id="sessions"
            onChange={handleSessionsFile}
            />

           {/* <div class="form-group">
                <label for="sessions">Sessions File</label>
                <input type="file" style={{display: "inline-block"}} class="form-control" id="sessions" onChange={handleSessionsFile} />
            </div> */}
        </div>
    );


};

export default Agenda;