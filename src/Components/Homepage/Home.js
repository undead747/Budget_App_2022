import React, { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/authContext';
import { Button } from '../CommonComponents/Button/Button';
import DailyTasks from './DailyTasks/DailyTasks';
import MonthlyTasks from './MonthlyTasks/MonthlyTasks';
import Navigator from './Navigator/Navigator';
import Sidebar from './Sidebar/Sidebar';
import TasksByCalendar from './TasksByCalendar/TasksByCalendar';
import TasksByYears from './TasksByYears/TasksByYears';
import WeeklyTasks from './WeeklyTasks/WeeklyTasks';


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
          <Route path={'/daily/:date?'} component={DailyTasks} />
          <Route path={'/weekly/:date?'} component={WeeklyTasks} />
          <Route path={'/monthly/:date?'} component={MonthlyTasks} />
          <Route path={'/years/:date?'} component={TasksByYears} />
          <Route path={'/calendar/:date?'} component={TasksByCalendar} />

          <Redirect to={'/daily'} />
          
          <Button callback={handleLogout}>Sign out</Button>
      </Switch>

    </>
  )
}
