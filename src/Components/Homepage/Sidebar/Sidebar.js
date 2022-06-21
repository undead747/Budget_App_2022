import React from 'react';
import { Link, useHistory } from 'react-router-dom';
import './sidebar.css';
import { useHomeController } from '../../HomeContext';
import { sidebarData } from './SidebarData';


function Sidebar(props) {
    const {selectedTab, setSelectTab} = useHomeController();
    const history = useHistory();

    const handleSelectedTab = (tab) => {
        setSelectTab(tab.id);
        history.push(tab.path);
    }
    
    return (
        <ul className='nav-bar'>
            {
                sidebarData.map(tab => {
                    return <li className={`nav-bar__item ${ selectedTab === tab.id ? 'active' : '' }`} key={tab.id}>
                    <Link to={tab.path} className='nav-bar__link' onClick={() => handleSelectedTab(tab)}>{tab.title}</Link>
                </li>
                })
            }
        </ul>
    );
}

export default Sidebar;