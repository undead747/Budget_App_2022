import React, { useEffect, useRef } from 'react'
import DropdownMode from './DropdownMode'
import Navigator from './Navigator'
import './income-expense.css'
import ToggleTaskMode from './ToggleTaskMode'
import { StatisticsMode, useStatistics } from '../StatisticsContext'
import { useHistory } from 'react-router-dom'
import { taskModes } from '../../../Constants/TaskConstaints'
import { DatabaseCollections, useFirestore } from '../../../Database/useFirestore'

export default function IncomesAndExpenses() {
  const { currDate, taskMode, statisticsMode } = useStatistics();
  const history = useHistory();
  const loadDataFlag = useRef(false);

  // Database method
  const { getDocumentsByPagination } = useFirestore(
    DatabaseCollections.Tasks
  );

  useEffect(() => {
    if (!currDate || !statisticsMode || !taskMode) {
      const date = new Date();
      let month = date.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;
      history.push(`/statistics?taskMode=${taskModes.Income.param}&statisticsMode=${StatisticsMode.ByMonth.name}&month=${month}&year=${date.getFullYear()}`)
      return
    };


  }, [currDate, taskMode, statisticsMode])

  const loadTasksByMonth = async (month, year) => {
    if (month) month = Number(month) - 1;

    let firstDayOfMonth = getFirstDayOfMonth(month, year);
    let lastDayOfMonth = getLastDayOfMonth(month, year);

    let tasks = await getDocumentsByPagination({
      params: [
        { key: Tasks.formatedDate, operator: ">=", value: firstDayOfMonth },
        { key: Tasks.formatedDate, operator: "<=", value: lastDayOfMonth },
      ],
    });
  }

  const loadDataByMonth = () => {

  }

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
