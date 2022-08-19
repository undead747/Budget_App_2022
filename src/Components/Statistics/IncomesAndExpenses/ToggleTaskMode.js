import React, { useEffect } from 'react'
import { Link, useHistory } from 'react-router-dom';
import { taskModes } from '../../../Constants/TaskConstaints';
import { useStatistics } from '../StatisticsContext';

export default function ToggleTaskMode() {
// #region State
const {currDate, taskMode, statisticsMode} = useStatistics();
const history = useHistory();

const handleSelectedTab = (tabMode) => {
  const dateVal = new Date(currDate);
  let month = dateVal.getMonth() + 1;
  if (month.toString().length === 1) month = `0${month}`;
  history.push(`/statistics?taskMode=${tabMode}&statisticsMode=${statisticsMode}&month=${month}&year=${dateVal.getFullYear()}`)
}

    return(<>
         <ul className='nav-bar'>
            {
                Object.keys(taskModes).map(key => {
                    let tab = taskModes[key];

                    return <li className={`nav-bar__item ${ taskMode === tab.param ? 'active' : '' }`} key={tab.id}>
                    <a className='nav-bar__link' onClick={() => handleSelectedTab(tab.param)}>{tab.name}</a>
                </li>
                })
            }
        </ul>
    </>)
}
