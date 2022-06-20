import React from 'react';
import './sidebar.css'

function Sidebar(props) {
    return (
        <ul className='nav-bar'>
            <li className='nav-bar__item active'>Daily</li>
            <li className='nav-bar__item'>Calendar</li>
            <li className='nav-bar__item'>Weekly</li>
            <li className='nav-bar__item'>Monthly</li>
            <li className='nav-bar__item'>Summary</li>
        </ul>
    );
}

export default Sidebar;