import React, { createContext,useEffect, useState } from 'react';

import axios from 'axios';

const REACT_APP_API_URL='6bc51d30c315569772b87aacdada48f733ebd5c6';

export const HolidaysContext = createContext();

export default function HolidayContext(props) {

    const [holidays,setHolidays] = useState([]);
    const [location,setLocation] = useState("in");
    useEffect(() =>{
        axios.defaults.withCredentials = false;
        
        // if(navigator.geolocation){
        //     navigator.geolocation.getCurrentPosition(function(pos){

        //     })
        // }
        navigator.geolocation.getCurrentPosition(function(loc){
            console.log(loc);
        })
        axios.get(`https://calendarific.com/api/v2/holidays?&api_key=${REACT_APP_API_URL}&country=${location}&year=${props.val.clone().format('YYYY')}`)
        .then(res => res.data)
        .then(data =>{
            let val = data.response.holidays;
            val.forEach(obj => {
                obj.open=false
            });
            setHolidays(val);
            // console.log(data.response.holidays);
        }).catch(err =>{
            console.log(err);
        })
    },[props.val,location])
    const  value = {
        holidays
    }
    return (
        <HolidaysContext.Provider value={value}>
            {props.children}
        </HolidaysContext.Provider>
    );
}
