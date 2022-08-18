import React from 'react'
import DropdownMode from './DropdownMode'
import Navigator from './Navigator'
import './income-expense.css'
import ToggleTaskMode from './ToggleTaskMode'

export default function IncomesAndExpenses() {
  return (
    <div className='incomesAndExpenses'>
        <div className='incomesAndExpenses__Header'>
            <div className='incomesAndExpenses__Dropdown'>
              <DropdownMode />
            </div>
            <Navigator />
            <ToggleTaskMode />
        </div>
    </div>
  )
}
