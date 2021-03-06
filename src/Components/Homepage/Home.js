import React, { useState } from 'react'
import { Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { useAuth } from '../../Auth/authContext';
import { CustomButton } from '../CommonComponents/Button/Button';
import DailyTasks from './DailyTasks/DailyTasks';
import MonthlyTasks from './MonthlyTasks/MonthlyTasks';
import Navigator from './Navigator/Navigator';
import Sidebar from './Sidebar/Sidebar';
import TasksByCalendar from './TasksByCalendar/TasksByCalendar';
import TasksByYears from './TasksByYears/TasksByYears';
import WeeklyTasks from './WeeklyTasks/WeeklyTasks';
import "./home.css";
import EclipseButton from '../CommonComponents/Button/EclipseButton';


export default function Home() {

  const [errors, setErrors] = useState()
  const { logout } = useAuth()
  const history = useHistory()

  const handleAddTask = () => {
      history.push("/task/add");
  }

  async function handleLogout() {
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
      <div className='header'>
        <Navigator />
        <Sidebar />
      </div>

      <Switch>
        <Route path={'/daily/:date?'} render={routes => <DailyTasks key={routes.match.params.date} {...routes} />} />
        <Route path={'/weekly/:date?'} component={WeeklyTasks} />
        <Route path={'/monthly/:date?'} component={MonthlyTasks} />
        <Route path={'/years/:date?'} component={TasksByYears} />
        <Route path={'/calendar/:date?'} component={TasksByCalendar} />

        <Redirect to={'/daily'} />
      </Switch>
      <CustomButton callback={handleLogout}>Sign out</CustomButton>
      <EclipseButton customClass="btn--task-add" callback={handleAddTask}><i className="fas fa-plus"></i></EclipseButton>
    </>
  )
}
