import React, { useEffect, useRef, useState } from 'react'
import { useHistory, useLocation } from 'react-router-dom';
import { taskModes } from '../../../Constants/TaskConstaints';
import { CustomButton } from '../../CommonComponents/Button/Button';
import { StatisticsMode, useStatistics } from '../StatisticsContext';

export default function Navigator() {
  // #region State
  const {currDate, taskMode, statisticsMode} = useStatistics();
  const history = useHistory();
  const datePickerRef = useRef();
  // #endregion State

  // #region Function
  useEffect(() => {
    const date = new Date();

    if (!currDate || !statisticsMode || !taskMode) {
      let month = date.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;

      history.push(`/statistics?taskMode=${taskModes.Income.param}&statisticsMode=${StatisticsMode.ByMonth.name}&month=${month}&year=${date.getFullYear()}`)
      return
    };

    datePickerRef.current.value = currDate;
  }, [currDate, taskMode, statisticsMode])

//   const preDate = () => {
//     let url = null,
//       preDate = null;

//     preDate = getPreDate(new Date(currDate));
//     history.push(`/statistics?mode=${StatisticsMode.Incomes.param}&month=${month}&year=${date.getFullYear()}`)
//   }
// };

// const handleDatePicker = () => {
//   if (datePickerRef.current.value) {
//     let selectedDate = new Date(datePickerRef.current.value),
//       url = null;

//     switch (selectedTab) {
//       case sidebarData[0].id:
//         url = `/daily/${getFormatDateForDatePicker(nextDate)}`;
//         break;
//       case sidebarData[1].id:
//         url = `/monthly/?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`
//         break;
//       default:
//         break;
//     }

//     if (url) history.push(url);
//   }
// };

const preDate = () => {

}

const nextDate = () => {

}

const handleDatePicker = () => {
  
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
