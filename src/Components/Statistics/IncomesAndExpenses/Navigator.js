import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { taskModes } from '../../../Constants/TaskConstaints';
import { getNextDate, getNextMonth, getPreDate, getPreMonth } from '../../../Helpers/DateHelper';
import { CustomButton } from '../../CommonComponents/Button/Button';
import { StatisticsMode, useStatistics } from '../StatisticsContext';

export default function Navigator() {
  // #region State
  const { currDate, taskMode, statisticsMode } = useStatistics();
  const history = useHistory();
  const datePickerRef = useRef();
  // #endregion State

  // #region Function
  useEffect(() => {
    if(currDate) datePickerRef.current.value = currDate;
  }, [currDate])

  const preDate = () => {
    const preDate = getPreMonth(new Date(currDate));
    let month = preDate.getMonth() + 1;
    if (month.toString().length === 1) month = `0${month}`;

    history.push(`/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${preDate.getFullYear()}`)
  }

  const nextDate = () => {
    const nextDate = getNextMonth(new Date(currDate));
    let month = nextDate.getMonth() + 1;
    if (month.toString().length === 1) month = `0${month}`;

    history.push(`/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${nextDate.getFullYear()}`)
  }

  const handleDatePicker = () => {
  if (datePickerRef.current.value) {
      let selectedDate = new Date(datePickerRef.current.value);
      let month = selectedDate.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;

      history.push(`/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${selectedDate.getFullYear()}`)
    }
  }
  // #region Function

  return (
    <>
      <div className="navigator">
        <CustomButton customClass="navigator__button" callback={() => preDate()} disabled={!currDate}>
          <i className="fas fa-angle-left"></i>
        </CustomButton>
        <input
          className="form-control navigator__date-picker"
          type={"month"}
          ref={datePickerRef}
          onChange={handleDatePicker}
        />

        <CustomButton customClass="navigator__button" callback={() => nextDate()} disabled={!currDate}>
          <i className="fas fa-angle-right"></i>
        </CustomButton>
      </div>
    </>
  )
}
