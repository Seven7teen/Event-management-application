import { useState } from 'react';
import axios from 'axios';

const ZOOM_API_KEY = '90GH4SbjTba3FrUSoMg5tQ';
const ZOOM_API_SECRET = 'B0cSlmMtT7iLSt1j7S5sScN2uCuB4vQhQn9U';

const GoogleCalendarEvent = ({title, startTime, endTime}) => {
  const [meetingId, setMeetingId] = useState(null);
  const [meetingPassword, setMeetingPassword] = useState(null);

  const createMeeting = async (e) => {
    e.preventDefault();
    const API_KEY = '90GH4SbjTba3FrUSoMg5tQ';
    const API_SECRET = 'B0cSlmMtT7iLSt1j7S5sScN2uCuB4vQhQn9U';
    const jwtToken = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOm51bGwsImlzcyI6IjkwR0g0U2JqVGJhM0ZyVVNvTWc1dFEiLCJleHAiOjE2ODEyMDI2NDQsImlhdCI6MTY4MTE5NzI0Nn0.snTqxM0AKehaYqr-uypTjVuv0nFu_OlKI__y0ZU_WxE';
    const MEETING_TOPIC = 'New Zoom Meeting';
    const MEETING_TYPE = 2;
    const TIMEZONE = 'America/Los_Angeles';

    try {
      const url = 'http://localhost:5000/create-meeting';
      const response = await axios.post(url, {
        topic: MEETING_TOPIC,
        // type: MEETING_TYPE,
        start_time: new Date(),
        duration: 60,
        // timezone: TIMEZONE,
      // }, {
      //   headers: {
      //     // Authorization: `Bearer ${API_KEY}.${API_SECRET}`,
      //     Authorization: `Bearer ${jwtToken}`,
      //     'Content-Type': 'application/json',
      //   },
      });
      console.log(response.data, "Sds");
      setMeetingId(response.data.id);
      setMeetingPassword(response.data.password);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      <button onClick={createMeeting}>Create Zoom Meeting</button>
      {meetingId && <p>Meeting ID: {meetingId}</p>}
      {meetingPassword && <p>Meeting Password: {meetingPassword}</p>}
    </div>
  );
};

export default GoogleCalendarEvent;

