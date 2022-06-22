import React, { useEffect, useState } from 'react'
import { matchPath, useHistory, useLocation } from 'react-router-dom';
import { getFormatDateParam, getFormatDateTitle, getNextDate, getPreDate } from '../../../Helpers/DateHelper';
import { Button } from '../../CommonComponents/Button/Button';
import { useHomeController } from '../../HomeContext';
import '../Sidebar/SidebarData'
import './navigator.css';

export default function Navigator() {
  const {selectedTab} = useHomeController();
  const [title, setTitle] = useState();
  const history = useHistory();
  const {pathname} = useLocation();

  const getDateParam = () => {
     let dateParam =  matchPath(pathname, { path:"/:mode/:date?" });
     return dateParam ? dateParam.params.date : dateParam;
  }

  useEffect(() => {
    let dateParam = getDateParam();
    if(selectedTab === 0 && dateParam){
       setTitle(getFormatDateTitle(new Date(dateParam)));
     }
  })

  const preDate = () => {
    let dateParam = getDateParam();
    
    if(selectedTab === 0 && dateParam){
      let preDate = getPreDate(new Date(dateParam));
      history.push(`/daily/${getFormatDateParam(preDate)}`);
    }
  }

  const nextDate = () => {
    let dateParam = getDateParam();
    
    if(selectedTab === 0 && dateParam){
      let nextDate = getNextDate(new Date(dateParam));
      history.push(`/daily/${getFormatDateParam(nextDate)}`);
    }
  }

  return (
    <div className='navigator'>
        <Button callback={() => preDate()}><i className="fas fa-angle-left"></i></Button>
        <h5 className='navigator__title'>{title}</h5>
        <Button callback={() => nextDate()}><i className="fas fa-angle-right"></i></Button>
    </div>
  )
}
