import React, { useEffect, useState } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { Tasks } from '../../../Constants/TaskConstaints';
import { DatabaseCollections, useFirestore } from '../../../Database/useFirestore';
import { getFormatDateForDatePicker, getFormatDateParam } from '../../../Helpers/DateHelper';
import Summary from '../Summary/Summary';
import './daily-task.css';

export default function DailyTasks() {
  const param = useParams();
  const history = useHistory();
  const [tasks, setTasks] = useState();
  const {getDocumentsByPagination} = useFirestore(DatabaseCollections.Tasks);
  useEffect(()=>{
      if(!param.date && param.date !== 0) history.push(`/daily/${getFormatDateForDatePicker()}`);
      if(param.date || param.date === 0 && !tasks){
        getDocumentsByPagination({params: {[Tasks.date]: param.date}}).then((data) => {
              console.log(data);
              setTasks(data);
            });
      }
  })

  return (
    <div className='daily'>
      <Summary />
      <table className='table task-table'>
          <thead>
              <tr className='task-table__header'>
                <th className='task-table__header-title'><i className='fas fa-long-arrow-alt-up'></i>Income</th>
                <th></th>
                <th className='text-end'><span className='text-success'>+ 400.00</span></th>
              </tr>
          </thead>
          <tbody>
              <tr className='task-table__row'>
                <td className='text-start'>Salary</td>
                <td className='text-start'>Cash</td>
                <td className='text-end fw-bolder'>+ 200.00</td>
              </tr>
              <tr className='task-table__row'>
                <td className='text-start'>Salary</td>
                <td className='text-start'>Cash</td>
                <td className='text-end fw-bolder'>+ 200.00</td>
              </tr>
          </tbody>
      </table>
    </div>
  )
}
