import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { useBudgets } from '../BudgetContext';
import { sidebarData } from './SidebarData';

export default function Sidebar() {
    const {selectedTab, setSelectTab} = useBudgets();
    const history = useHistory();

    const handleSelectedTab = (tab) => {
        history.push(tab.path);
    }

    useEffect(() => {
        const url = window.location.href;

        if(url.includes(sidebarData.Debt.path)){
            setSelectTab(sidebarData.Debt.id);
            return
        } 

        if(url.includes(sidebarData.SpendingLimit.path)){
            setSelectTab(sidebarData.SpendingLimit.id);
            return
        } 

        setSelectTab(sidebarData.Income.id);
    }, [window.location.href])
    
    return (
        <ul className='nav-bar container'>
            {
                Object.keys(sidebarData).map(key => {
                    let tab = sidebarData[key];

                    return <li className={`nav-bar__item ${ selectedTab === tab.id ? 'active' : '' }`} key={tab.id}>
                    <Link to={tab.path} className='nav-bar__link' onClick={() => handleSelectedTab(tab)}>{tab.title}</Link>
                </li>
                })
            }
        </ul>
    );
}
