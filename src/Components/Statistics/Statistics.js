import React from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import Budgets from './Budgets/Budgets';
import Header from './Header/Header';
import IncomesAndExpenses from './IncomesAndExpenses/IncomesAndExpenses';
import StatisticsProvider from './StatisticsContext';
import './statistics.css'


export default function Statistics() {
  return (
    <StatisticsProvider>
      <div className='statistics'>
        <div className='statistics__header'>
            <Header />
        </div>

        <Switch>
          <Route path={'/statistics/budgets'} component={Budgets} />
          <Route path={'/statistics/:mode?'} component={IncomesAndExpenses} />
          <Redirect to={'/statistics'} />
        </Switch>
      </div>
    </StatisticsProvider>
  )
}
