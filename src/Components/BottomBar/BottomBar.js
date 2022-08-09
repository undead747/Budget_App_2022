import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useHomeController } from '../HomeContext';
import { bottombarData } from './BottomBarData'
import './bottom-bar.css';

export default function BottomBar() {
    const {selectedBottomTab, setSelectBottomTab} = useHomeController();
    const history = useHistory();

    const handleSelectedTab = (tab) => {
        setSelectBottomTab(tab.id);
        history.push(tab.path);
    }

    useEffect(() => {
        let url = window.location.href;

        if(url.includes("statistics")){
            setSelectBottomTab(bottombarData.Statistics.id);
            return 
        }

        if(url.includes("budgets")){
            setSelectBottomTab(bottombarData.Budgets.id);
            return 
        }

        if(url.includes("settings")){
            setSelectBottomTab(bottombarData.Settings.id);
            return 
        }

        if(url.includes("daily") || url.includes("monthly") || url.includes("calendar")){
            setSelectBottomTab(bottombarData.Tasks.id);
            return
        }
    },[window.location.href])

    return (
        <div className='bottom-bar'>
            <ul className='nav-bar bottom-bar__content'>
                {
                    Object.keys(bottombarData).map(key => {
                        const tab = bottombarData[key];

                        return <li className={`nav-bar__item bottom-bar__item  ${selectedBottomTab === tab.id ? 'bottom-bar__item--active' : ''}`} key={tab.id} onClick={() => handleSelectedTab(tab)}>
                            <div className='bottom-bar__item-content'>
                                {tab.icon}
                                <span className='bottom-bar__title'>{tab.title}</span>
                            </div>
                        </li>
                    })
                }
            </ul>
        </div>
    )
}
