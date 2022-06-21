import React, { useEffect } from 'react'
import { useHistory, useParams } from 'react-router-dom'
import { getFormatDateParam } from '../../../Helpers/DateHelper';
import { useHomeController } from '../../HomeContext';

export default function DailyTasks() {
  const param = useParams();
  const history = useHistory();

  useEffect(()=>{
      if(!param.date && param.date !== 0) history.push(`/daily/${getFormatDateParam()}`);
  })

  return (
    <>
      <div>TasksByDays</div>
    </>
  )
}
