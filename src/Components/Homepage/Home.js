import React, { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/authContext';
import { Button } from '../CommonComponents/Button/Button';
import Navigator from './Navigator/Navigator';
import Sidebar from './Sidebar/Sidebar';
import TasksByCalendar from './TasksByCalendar/TasksByCalendar';
import TasksByDays from './TasksByDays/TasksByDays';
import TasksByMonths from './TasksByMonths/TasksByMonths';
import TasksByYears from './TasksByYears/TasksByYears';

export default function Home() {

  const [errors, setErrors] = useState()
  const {currentUser, logout} = useAuth()
  const history = useHistory()

  async function handleLogout(){
    setErrors('');
    try {
      await logout();
      history.push('/login');
    } catch (error) {
        setErrors(error.message)
    }
  }

  return (
    <>
      <Navigator />
      <Sidebar />
      <Switch>
          <Route path={'/days/:date?'} component={TasksByDays} />
          <Route path={'/calendar/:date?'} component={TasksByCalendar} />
          <Route path={'/months/:date?'} component={TasksByMonths} />
          <Route path={'/years/:date?'} component={TasksByYears} />

          <Redirect to={'/days/20220619'} />
      </Switch>

      <Button callback={handleLogout}>Sign out</Button>
    </>
  )
}
