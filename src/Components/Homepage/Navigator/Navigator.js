import React, { useEffect, useState } from 'react'
import ReactDatePicker from 'react-datepicker';
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { getFormatDateParam, getFormatDateTitle, getNextDate, getPreDate } from '../../../Helpers/DateHelper';
import { Button } from '../../CommonComponents/Button/Button';
import { useHomeController } from '../../HomeContext';
import '../Sidebar/SidebarData'
import './navigator.css';

export default function Navigator() {
  const {selectedTab} = useHomeController();
  const [title, setTitle] = useState();
  let currDate = null;
  const history = useHistory();
  const {pathname} = useLocation();

  const getCurrDate = () => {
     let dateParam =  matchPath(pathname, { path:"/:mode/:date?" });
     return dateParam ? new Date(dateParam.params.date) : dateParam;
  }

  useEffect(() => {
    currDate = getCurrDate();
    if(selectedTab === 0 && currDate){
       setTitle(getFormatDateTitle(currDate));
     }
  })

  const preDate = () => {
    if(selectedTab === 0 && currDate){
      let preDate = getPreDate(currDate);
      history.push(`/daily/${getFormatDateParam(preDate)}`);
    }
  }

  const nextDate = () => {
    if(selectedTab === 0 && currDate){
      let nextDate = getNextDate(currDate);
      history.push(`/daily/${getFormatDateParam(nextDate)}`);
    }
  }

  return (
    <div className='navigator'>
        <Button callback={() => preDate()} disabled={!!!title}><i className="fas fa-angle-left"></i></Button>
        <ReactDatePicker selected={new Date(title)} />
        <h5 className='navigator__title'>{title}</h5>
        <Button callback={() => nextDate()} disabled={!!!title}><i className="fas fa-angle-right"></i></Button>
    </div>
  )
}
