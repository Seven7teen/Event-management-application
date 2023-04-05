import React, { useState } from 'react';
import Button from '@material-ui/core/Button';
import firebase from '../../firbase';
import './tags.css';

const db = firebase.firestore();

function AgendaTags(props) {

    // const [error,setError] = useState(null);

    const [meetingInfo, setMeetingInfo] = useState({
        title: "",
        description: "",
        duration: ""
      });


    /* We will handle Delete Later */

    const handleDelete = item => {
        props.setAgenda(props.agenda.filter(i => i.title !== item));
        // props.setPid(props.pid.filter(i => i.email!==item));
        // props.setPeople(props.people.filter(i => i!==item));
    }

    const handleTitleChange = (event) => {
        setMeetingInfo({ ...meetingInfo, title: event.target.value });
      };
    
    const handleDescriptionChange = (event) => {
        setMeetingInfo({ ...meetingInfo, description: event.target.value });
    };

    const handleDurationChange = (event) => {
        setMeetingInfo({ ...meetingInfo, duration: event.target.value });
    };

    const handleAddingAgenda = async function (event) {
        event.preventDefault();
        await setId(meetingInfo);
        setMeetingInfo({
          title: "",
          description: "",
          duration: ""
        });
    }

    // const handleKeyDown = async e => {
    //     if(["Enter","Tab", ","].includes(e.key)) {
    //         var val = value.trim();
    //             await setId(value);
    //             setValue("");
    //     }
    // }

    const setId = async (meetingInfo) => {
        var arr = [...props.agenda];
        arr.push({
            title: meetingInfo.title,
            description: meetingInfo.description,
            duration: meetingInfo.duration
        });
        props.setAgenda(arr);
        console.log(arr);
    }

    // const handlePaste =async e => { /* Adding one email by copying from clipboard */
    //     e.preventDefault();

    //     var paste = e.clipboardData.getData("text");
    //     console.log(paste);
    //     await setId(paste);
    // };

    return (
        <>
        <h2>Add Agenda</h2>
        {props.agenda.map(item => (
          <div className="tag-item" key={item.title}>
            <div className="title" >
            <div style={{height:"10px",width:"10px",borderRadius:"100%",backgroundColor:"rgb(3, 155, 229)",margin:"5px 5px 0 0",display:"inline-block"}}>
                </div>
                {item.title}
            </div>
            <br />
            <div className='description'>
                
                {item.description}
            </div>
            <br />
            <div className='description' >
                {item.duration}
            </div><br />
            <Button className="button"
              onClick={() => handleDelete(item.title)}>
                &times;
            </Button>
            {/* <button
              type="button"
              className="button"
              onClick={() => handleDelete(item.title)}
            >
               &times;
            </button> */}
          </div>
        ))}

        {/* <input
          className={"input " + (error && " has-error")}
          value={value}
          placeholder="Type or paste title of agenda and press `Enter`..."
          onKeyDown={handleKeyDown}
          onChange={handleChange}
        //   onPaste={handlePaste}
        /> */}
        <br />
        <label>Title:</label>
        <input
            type="text"
            className="input"
            placeholder="Type title of agenda"
            value={meetingInfo.title}
            onChange={handleTitleChange}
        />
        <br />
        <label>Description:</label>
        <textarea
            className="input"
            placeholder="Type description of agenda"
            value={meetingInfo.description}
            onChange={handleDescriptionChange}
        ></textarea>
        <br />
        <label>Duration:</label>
        <input
            type="text"
            className="input"
            placeholder="Type duration of agenda"
            value={meetingInfo.duration}
            onChange={handleDurationChange}
        />
        <button className='butt' onClick={handleAddingAgenda}>
                Add Agenda
        </button>
        {/* {error && <p className="error">{error}</p>} */}
      </>
    );
}

export default AgendaTags;