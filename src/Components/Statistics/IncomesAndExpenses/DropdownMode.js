import React, { useEffect, useRef } from 'react'
import Form from 'react-bootstrap/Form';
import { StatisticsMode, useStatistics } from '../StatisticsContext';

export default function DropdownMode() {
  const selectRef  = useRef();
  const {statisticsMode, setStatisticsMode} = useStatistics();

  useEffect(() => {

  },[statisticsMode])

  return (
    <Form.Select size="sm" ref={selectRef}>
      {
        StatisticsMode && Object.keys(StatisticsMode).map(key => {
          return <option key={key}>{StatisticsMode[key].name}</option>
        })
      }
    </Form.Select>
  )
}
