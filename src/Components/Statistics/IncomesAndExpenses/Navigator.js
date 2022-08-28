import React, { useEffect, useRef, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useHistory, useLocation } from "react-router-dom";
import { taskModes } from "../../../Constants/TaskConstaints";
import {
  getNextDate,
  getNextMonth,
  getPreDate,
  getPreMonth,
} from "../../../Helpers/DateHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { StatisticsMode, useStatistics } from "../StatisticsContext";

export default function Navigator() {
  // #region State
  const { currDate, taskMode, statisticsMode } = useStatistics();
  const history = useHistory();
  const datePickerRef = useRef();
  // #endregion State

  // #region Function
  useEffect(() => {
    if (currDate && statisticsMode === StatisticsMode.ByMonth.name)
      datePickerRef.current.value = currDate;
  }, [currDate, statisticsMode]);

  const preDate = () => {
    let url = null;

    switch (statisticsMode) {
      case StatisticsMode.ByMonth.name:
        const preDate = getPreMonth(new Date(currDate));
        let month = preDate.getMonth() + 1;
        if (month.toString().length === 1) month = `0${month}`;
        url = `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${preDate.getFullYear()}`;
        break;
      case StatisticsMode.ByYear.name:
        const year = new Date(currDate);
        url = `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=01&year=${
          Number(year.getFullYear()) - 1
        }`;
      default:
        break;
    }

   
    history.push(url);
  };

  const nextDate = () => {
    let url = null;

    switch (statisticsMode) {
      case StatisticsMode.ByMonth.name:
        const nextDate = getNextMonth(new Date(currDate));
        let month = nextDate.getMonth() + 1;
        if (month.toString().length === 1) month = `0${month}`;
        url = `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${nextDate.getFullYear()}`;
        break;
      case StatisticsMode.ByYear.name:
        const year = new Date(currDate);
        url = `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=01&year=${
          Number(year.getFullYear()) + 1
        }`;
      default:
        break;
    }

    history.push(url);
  };

  const handleDatePicker = () => {
    if (datePickerRef.current.value) {
      let selectedDate = new Date(datePickerRef.current.value);
      let month = selectedDate.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;

      history.push(
        `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=${month}&year=${selectedDate.getFullYear()}`
      );
    }
  };

  const getCurrYearDate = () => {
    if (!currDate) return;

    return new Date(currDate);
  };

  const handleReactDatePicker = (date) => {
    if (!date) return;

    history.push(
      `/statistics?taskMode=${taskMode}&statisticsMode=${statisticsMode}&month=01&year=${date.getFullYear()}`
    );
  };
  // #region Function

  return (
    <>
      <div className="navigator">
        <CustomButton
          customClass="navigator__button"
          callback={() => preDate()}
          disabled={!currDate}
        >
          <i className="fas fa-angle-left"></i>
        </CustomButton>
        {statisticsMode === StatisticsMode.ByMonth.name && (
          <input
            className="form-control navigator__date-picker"
            type={"month"}
            ref={datePickerRef}
            onChange={handleDatePicker}
          />
        )}

        {statisticsMode === StatisticsMode.ByYear.name && (
          <div>
            <ReactDatePicker
              id="DatePicker"
              type="string"
              className="form-control navigator__react-datepicker"
              selected={getCurrYearDate()}
              onChange={(date) => handleReactDatePicker(date)}
              showYearPicker
              dateFormat="yyyy"
              yearItemNumber={9}
              required
            />
          </div>
        )}

        <CustomButton
          customClass="navigator__button"
          callback={() => nextDate()}
          disabled={!currDate}
        >
          <i className="fas fa-angle-right"></i>
        </CustomButton>
      </div>
    </>
  );
}
