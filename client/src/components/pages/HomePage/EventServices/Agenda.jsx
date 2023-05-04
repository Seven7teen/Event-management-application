import React, {useState, useEffect} from "react";
import * as xlsx from 'xlsx';
import './styles.css';
import './speaker-styles.css';
import firebase from '../../../../firbase';
import moment from 'moment';


const db = firebase.firestore();

const Agenda = (props) => {
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
          const agendaData = excelData.map((row) => ({
              date: row['Date'] ? row['Date']  : 'Not Provided',
              timeStart: row['Time Start'] ? moment().startOf('day').add(row['Time Start'] * 24, 'hours').format("h:mm A")  : 'Not Provided',
              timeEnd: row['Time End'] ? moment().startOf('day').add(row['Time End'] * 24, 'hours').format("h:mm A")  : 'Not Provided',
              tracks: row['Tracks (Optional)'] ? row['Tracks (Optional)']  : 'Not Provided',
              sessionTitle: row['Session Title'] ? row['Session Title']  : 'Not Provided',
              location: row['Room/Location'] ? row['Room/Location'] : 'Not Provided',
              description: row['Description (Optional)'] ? row['Description (Optional)'] : 'Not Provided',
              speakers: row['Speakers (Optional)'] ? row['Speakers (Optional)']  : 'Not Provided',
              authors: row['Authors (Optional)'] ? row['Authors (Optional)']  : 'Not Provided'
          }));
          setRawSessionsData(agendaData);
        };
      };

    return (
        <div className="inputTab">
            <div class="form-group">
                <label for="attendees">Attendees File</label>
                <input type="file" class="form-control" id="attendees" onChange={handleAttendeesFile} />
            </div>

            <div class="form-group">
                <label for="speakers">Speakers File</label>
                <input type="file" class="form-control" id="speakers" onChange={handleSpeakersFile} />
            </div>

           <div class="form-group">
                <label for="sessions">Sessions File</label>
                <input type="file" class="form-control" id="sessions" onChange={handleSessionsFile} />
            </div>
        </div>
    );


};

export default Agenda;