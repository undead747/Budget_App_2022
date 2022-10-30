import React from 'react'
import { Redirect, Route, Switch } from 'react-router-dom'
import BudgetProvider from './BudgetContext'
import Debts from './Debts/Debts'
import Incomes from './Incomes/Incomes'
import Sidebar from './Sidebar/Sidebar'
import './budgets.css'

export default function Budgets() {
  return (
     <BudgetProvider>
      <div className='header budgets__header'>
         <Sidebar />
      </div>
      <div className="budgets__content container">
        <Switch>
            <Route path={'/budgets/debts'} component={Debts} />
            <Route path={'/budgets'} component={Incomes} />
            <Redirect to={'/'} />
        </Switch>
      </div>
     </BudgetProvider>
  )
}
