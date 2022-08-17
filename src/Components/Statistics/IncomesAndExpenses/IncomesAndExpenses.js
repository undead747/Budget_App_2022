import React from 'react'
import DropdownMode from './DropdownMode'
import Navigator from './Navigator'
import ToggleModebar from './ToggleModebar'
import './income-expense.css'

export default function IncomesAndExpenses() {
  return (
    <div className='incomesAndExpenses'>
        <div className='incomesAndExpenses__Header'>
            <div className='incomesAndExpenses__Dropdown'>
              <DropdownMode />
            </div>
            <Navigator />
            <ToggleModebar />
        </div>
    </div>
  )
}
