import React, { useState } from 'react';
import MainContent from "./MainContent";
import SessionsTab from './SessionsTab';
import Attendees from './Attendees';
import Speakers from './Speakers'
import Agenda from './Agenda';
import JitsiComponent from './JitsiComponent';
import ChatBox from './ChatBox';
import './styles.css';


const Sidebar = (props) => {
  const [activeItem, setActiveItem] = useState('Contact');
  const [click, setClick] = useState(false);
  const [dataFromChild, setDataFromChild] = useState(0);

  const handleChildData = (data) => {
    setDataFromChild(data);
  };

  const handleItemClick = (itemName) => {
    if(itemName === 'Agenda') {
        setClick(!click);
    }
    setActiveItem(itemName);
  };

  return (
    <div className="sidebar">
      <ul>
        {/* <li className={activeItem === 'Home' ? 'active' : ''} onClick={() => handleItemClick('Home')}>
          Home
        </li> */}
        <li className={activeItem === 'Agenda' ? 'active' : ''} onClick={() => handleItemClick('Agenda')}>
          Agenda {click ? <span>{'V'}</span> : <span>{'>'}</span>}
        </li>

        { click ?  <li className={activeItem === 'Sessions' ? 'active' : ''} onClick={() => handleItemClick('Sessions')}>
        Sessions
        </li> : <></>
        }
        {click ? <li className={activeItem === 'Speakers' ? 'active' : ''} onClick={() => handleItemClick('Speakers')}>
        Speakers
        </li> : <></>
        }    

        <li className={activeItem === 'Attendees' ? 'active' : ''} onClick={() => handleItemClick('Attendees')}>
          Attendees
        </li>
        <li className={activeItem === 'Contact' ? 'active' : ''} onClick={() => handleItemClick('Contact')}>
          Contact <span>{dataFromChild}</span>
        </li>
        <li className={activeItem === 'Query' ? 'active' : ''} onClick={() => handleItemClick('Query')}>
          Query
        </li>
      </ul>
      <div className="main-content">
        {/* {activeItem === 'Home' && (
          <div>
            <MainContent />
            <h2>Home</h2>
            <p>Welcome to the Home page!</p>
          </div>
        )} */}
        {
          activeItem === 'Agenda' && (
            <Agenda globalEventId={props.globalEventId} />
          )
        }
        {
          activeItem === 'Sessions' && (
            <SessionsTab globalEventId={props.globalEventId} />
          )
        }
        {activeItem === 'Speakers' && (
          <Speakers globalEventId={props.globalEventId} />
        )}
        {activeItem === 'Attendees' && (
            <Attendees globalEventId={props.globalEventId} />
        )}
        {activeItem === 'Contact' && (
          <div>
            {/* <ExcelSheetInput /> */}
            <JitsiComponent onChildClick={handleChildData}/>
          </div>
        )}
        {activeItem === 'Query' && (
          <div>
            {/* <ExcelSheetInput /> */}
            {/* <ChatBox /> */}
          </div>
        )}
      </div>
    </div>
  );
};

export default Sidebar;
