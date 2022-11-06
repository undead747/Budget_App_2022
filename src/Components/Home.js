import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom';
import Alert from './Alert/Alert';
import BottomBar from './BottomBar/BottomBar';
import Budgets from './Budgets/Budgets';
import TaskForm from './Form/TaskForm/TaskForm';
import Tasks from './Homepage/Tasks';
import Settings from './Settings/Settings';
import Statistics from './Statistics/Statistics';

export default function Home() {
    return (
        <div>
            <Switch>
                <Route path={'/task/:mode/:id?'} component={TaskForm} />
                <Route path={'/statistics'} component={Statistics} />
                <Route path={'/budgets'} component={Budgets} />
                <Route path={'/settings'} component={Settings} />
                <Route path={'/'} component={Tasks} />
                <Redirect to={"/"} />
            </Switch>
            <Alert />
            <BottomBar />
        </div>
      );
}
