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
  const param = useParams();
  const history = useHistory();
  const {pathname} = useLocation();

  useEffect(() => {
    const dateParam =  matchPath(pathname, { path:"/daily/:date" }) ? matchPath(pathname, { path:"/daily/:date" }).params.date : null;
    
    if(selectedTab === 0 && dateParam){
      let selectedDate = new Date(dateParam);
       setTitle(getFormatDateTitle(selectedDate));
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
