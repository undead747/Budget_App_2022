import React, { useEffect, useState } from 'react'
import { matchPath, useHistory, useLocation, useParams } from 'react-router-dom';
import { getFormatDateTitle } from '../../../Helpers/DateHelper';
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
  }

  return (
    <div className='navigator'>
        <Button><i className="fas fa-angle-left"></i></Button>
        <h5 className='navigator__title'>{title}</h5>
        <Button><i className="fas fa-angle-right"></i></Button>
    </div>
  )
}
