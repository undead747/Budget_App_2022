import React, { useEffect, useRef, useState } from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { getFormatDateForDatePicker, getNextDate, getPreDate } from '../../../Helpers/DateHelper';
import { CustomButton } from '../../CommonComponents/Button/Button';
import { useHomeController } from '../../HomeContext';
import '../Sidebar/SidebarData'
import './navigator.css';

export default function Navigator(tabId) {
  const {selectedTab} = useHomeController();
  const [currDate, setCurrDate] = useState();
  const history = useHistory();
  const {pathname} = useLocation();
  const datePickerRef = useRef();

  const getCurrDate = () => {
     let dateParam =  matchPath(pathname, { path:"/:mode/:date?" });
     return dateParam ? dateParam.params.date : dateParam;
  }

  useEffect(() => {
     if(currDate) datePickerRef.current.value = getFormatDateForDatePicker(new Date(currDate));
  }, [currDate])

  useEffect(() => {
    setCurrDate(getCurrDate());
  })

  const preDate = () => {
    if(selectedTab === 0 && currDate){
      let preDate = getPreDate(new Date(currDate));
      history.push(`/daily/${getFormatDateForDatePicker(preDate)}`);
    }
  }

  const nextDate = () => {
    if(selectedTab === 0 && currDate){
      let nextDate = getNextDate(new Date(currDate));
      history.push(`/daily/${getFormatDateForDatePicker(nextDate)}`);
    }
  }

  const handleDatePicker = () => {
    if(selectedTab === 0 && datePickerRef.current.value){
      let selectedDate = new Date(datePickerRef.current.value);
      history.push(`/daily/${getFormatDateForDatePicker(selectedDate)}`);
    }
  }

    return (
    <div className='navigator'>
        <CustomButton callback={() => preDate()} disabled={!!!currDate}><i className="fas fa-angle-left"></i></CustomButton>
        <input className='form-control navigator__date-picker' type={'date'} ref={datePickerRef} onChange={handleDatePicker} />
        <CustomButton callback={() => nextDate()} disabled={!!!currDate}><i className="fas fa-angle-right"></i></CustomButton>
    </div>
  )
}
