import React, { useEffect, useState } from "react";
import { Button } from '../../../Button';
import { Link,useHistory } from 'react-router-dom';
import '../../../Navbar/Navbar.css';
import firebase from '../../../../firbase';
import { MdFingerprint } from 'react-icons/md';
import { FaBars, FaTimes } from 'react-icons/fa';
import { useAuth } from '../../../Auth/AuthContext';
import { IconContext } from 'react-icons/lib';


const db = firebase.firestore();

const EventNavigation = (props) => {

    // const [currentUserName, setCurrentUserName] = useState();

    const [globalEvent, setGlobalEvent] = useState({
        globalEventName: "Event",
        startDate: new Date(),
        endDate: new Date()
    });

    const [click, setClick] = useState(false);
    const [button, setButton] = useState(true);
    const [error,setError] = useState("");
    const history = useHistory();
    const {logOut,currentUser} = useAuth();

    const handleClick = () => setClick(!click);
    const closeMobileMenu = () => setClick(false);
  

    useEffect(async () => {
        await db.collection("globalEvents").doc(props.globalEventId).onSnapshot((doc) => {
            if(doc.exists){
                setGlobalEvent({
                    globalEventName: doc.data().globalEventName,
                    startDate: new Date(doc.data().startDate),
                    endDate: new Date(doc.data().endDate)
                })          
            } else {
                console.log("error");
            }
        });
    },[]);

    const showButton = () => {
        if (window.innerWidth <= 960) {
          setButton(false);
        } else {
          setButton(true);
        }
      };
    
      async function handleLogOut(){
        setError('');
        try {
          await logOut();
          history.push('/login');
        } catch {
          setError("Failed to Log Out");
        }
        
      }
      async function handleLogOutM(){
        setClick(false);
        setError('');
        try {
          await logOut();
          history.push('/login');
        } catch {
          setError("Failed to Log Out");
        }
        
      }

      const formatDates = (start,end) => {
        const day1 = start.getDate();
        const month1 = start.toLocaleString("default", { month: "short" });
        const year1 = start.getFullYear();

        const day2 = end.getDate();
        const month2 = end.toLocaleString("default", { month: "short" });
        const year2 = end.getFullYear();

        // console.log("Day:", day2);
        // console.log("Month:", month2);
        // console.log("Year:", year2);
        if(month2 === month1) {
            return `${month2} ${day1} - ${day2}, ${year1}`;
        }
        return `${month1} ${day1} - ${month2} ${day2}, ${year1}`;
      }
    

    return (

        <>
      <IconContext.Provider value={{ color: '#fff' }}>
        <nav className='navbar'>
          <div className='navbar-container container1'>
            {/* <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <MdFingerprint className='navbar-icon' />
              {globalEvent.globalEventName}
            </Link> */}
            {/* <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <MdFingerprint className='navbar-icon' />
              {globalEvent.startDate}
            </Link> */}
            {/* <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
              <MdFingerprint className='navbar-icon' />
              {globalEvent.endDate}
            </Link> */}

            <ul  className={click ? 'nav-menu active' : 'nav-menu'}>
                <li>
                <Link to='/' className='navbar-logo' onClick={closeMobileMenu}>
                <MdFingerprint className='navbar-icon' />
                </Link>
                </li>
                <li>
                
                <div className="nav-links homeEventName">
                {globalEvent.globalEventName}
                </div>
              
           
            <div className="nav-links dateNav">
                    {formatDates(globalEvent.startDate, globalEvent.endDate)}
                {/* {globalEvent.startDate.toDateString()}  */}
                </div>
                </li>
                {/* <li className='nav-item'>
                <div className="nav-links dateNav">
                    {formatDates(globalEvent.startDate, globalEvent.endDate)}
                {/* {globalEvent.startDate.toDateString()}  */}
                {/* </div> */}
                {/* </li> */}
                {/* <li className='nav-item'>
                <div className="nav-links">
                {globalEvent.endDate.toDateString()} 
                </div>
                </li> */}
            </ul>

            
            {/* <div className="nav-links">
                {globalEvent.endDate}
                </div> */}
            

            <div className='menu-icon' onClick={handleClick}>
              {click ? <FaTimes /> : <FaBars />}
            </div>
            <ul className={click ? 'nav-menu active' : 'nav-menu'}>
              <li className='nav-item'>
              <div className="nav-links">
                {props.userType}
                </div>
              </li>
              <li className='nav-item'>
                <div className="nav-links">
                {currentUser.displayName} 
                </div>
                {/* <div className="nav-links">
                {props.userType}
                </div> */}
              </li>
              {/* <li className='nav-item'>
                <Link to='/' className='nav-links' onClick={closeMobileMenu}>
                  Home
                </Link>
              </li> */}
              {/* <li className='nav-item'>
                <Link
                  to='/services'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  About
                </Link>
              </li>
              <li className='nav-item'>
                <Link
                  to='/services'
                  className='nav-links'
                  onClick={closeMobileMenu}
                >
                  Gallery
                </Link>
              </li> */}
              {/* <li className='nav-item'> */}
              {/* {currentUser &&
                (<Link
                  to={`/calendar/${currentUser.providerData[0].uid}`}
                  className='nav-links'
                  onClick={closeMobileMenu}
                >Calendar</Link>) 
              } */}
              {/* {currentUser &&
                (<Link
                  to={`/globalEvents`}
                  className='nav-links'
                  onClick={closeMobileMenu}
                >Events</Link>) 
              } */}
              {/* </li> */}
              {/* <li className='nav-item'>
              {currentUser &&
                (<Link
                  to={`/calendar/${currentUser.providerData[0].uid}`}
                  className='nav-links'
                  onClick={closeMobileMenu}
                >Calendar</Link>) 
              }
              
              </li> */}
              {/* <li className='nav-btn'>
                {button ? (
                  !currentUser ? (
                   <Link to='/login' className='btn-link'>
                    <Button buttonStyle='btn--outline'>SIGN IN</Button>
                  </Link> ) : (
                      <Button buttonStyle='btn--outline' onClick={handleLogOut}>Log Out</Button>
                  )
                ) : (
                  !currentUser ? (
                  <Link to='/login' className='btn-link'>
                    <Button
                      buttonStyle='btn--outline'
                      buttonSize='btn--mobile'
                      onClick={closeMobileMenu}
                    >
                      SIGN IN
                    </Button>
                  </Link> ) : (
                    <Button
                      buttonStyle='btn--outline'
                      buttonSize='btn--mobile'
                      onClick={handleLogOutM}
                    >
                      Log Out
                    </Button>
                  )
                  
                )}
              </li> */}
              {/* <li>
                <Button buttonStyle='btn--outline' onClick={logOut}>Log Out</Button>
              </li> */}
            </ul>
          </div>
        </nav>
      </IconContext.Provider>
    </>



        // <div className="navigateGlobalEvent">
        //     <div className="eventLeftNav">
        //     <span className="eventName navItem">{globalEvent.globalEventName}</span>
        //     <span className="navItem">{globalEvent.startDate}</span>
        //     <span className="navItem">--</span>
        //     <span className="navItem">{globalEvent.endDate}</span>
        //     </div>
        //     <div className="eventRightNav">
        //         <span className="navItem">{props.userType}</span>  
        //     <span className="userNameNav navItem">{currentUser.displayName}</span>
        //     <Link to='/' className='btn-link'>
        //         <span className="navItem">Home</span>
        //     {/* <button type="button" className="btn btn-light btn-sm">Home</button> */}
        //           </Link>
        //     </div>
        // </div>
    )

}

export default EventNavigation;