import React, { useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import { useHistory } from 'react-router-dom';
import { StatisticsMode, useStatistics } from '../StatisticsContext';

export default function DropdownMode() {
  const {currDate, statisticsMode, taskMode} = useStatistics();
  const history = useHistory();

  const handleSelectMode = (event) => {
      const selectedStatisticsMode = event.target.value;
      const dateVal = new Date(currDate);
      let month = dateVal.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;

      history.push(`/statistics?taskMode=${taskMode}&statisticsMode=${selectedStatisticsMode}&month=${month}&year=${dateVal.getFullYear()}`)
  }

  return (
    <Form.Select value={statisticsMode} size="sm" onChange={handleSelectMode} >
      {
        StatisticsMode && Object.keys(StatisticsMode).map(key => {
          return <option key={key} value={StatisticsMode[key].name}>{StatisticsMode[key].name}</option>
        })
      }
    </Form.Select>
  )
}
