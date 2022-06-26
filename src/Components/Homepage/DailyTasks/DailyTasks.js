import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getFormatDateParam } from '../../../Helpers/DateHelper';
import EclipseButton from '../../CommonComponents/Button/EclipseButton';
import Summary from '../Summary/Summary';
import './daily-task.css';

export default function DailyTasks() {
  const param = useParams();
  const history = useHistory();

  useEffect(()=>{
      if(!param.date && param.date !== 0) history.push(`/daily/${getFormatDateParam()}`);
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
                <td className='text-center'>Cash</td>
                <td className='text-end'>200.00</td>
              </tr>
              <tr className='task-table__row'>
                <td className='text-start'>Salary</td>
                <td className='text-center'>Cash</td>
                <td className='text-end'>200.00</td>
              </tr>
          </tbody>
      </table>
      
      <EclipseButton customClass="daily__btn"><i className="fas fa-plus"></i></EclipseButton>
    </div>
  )
}
