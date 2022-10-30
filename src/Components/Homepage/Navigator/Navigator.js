import React, { useEffect, useRef, useState } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import {
  getFormatDateForDatePicker,
  getNextDate,
  getNextMonth,
  getPreDate,
  getPreMonth,
} from "../../../Helpers/DateHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";
import "../Sidebar/SidebarData";
import { sidebarData } from "../Sidebar/SidebarData";
import DatePicker from "react-datepicker";
import "./navigator.css";

export default function Navigator(tabId) {
  // #region State
  const { selectedTab } = useHomeController();
  const [currDate, setCurrDate] = useState();
  const history = useHistory();
  const { pathname } = useLocation();
  const datePickerRef = useRef();
  // #endregion State

  // #region Function
  const getCurrDailyDate = () => {
    let dateParam = matchPath(pathname, { path: "/:mode/:date?" });
    return dateParam ? dateParam.params.date : null;
  };

  const getCurrMonthDate = () => {
    let search = window.location.search;
    let params = new URLSearchParams(search);
    let month = params.get("month");
    let year = params.get("year");

    if (!month || !year) return;

    if (month.length === 1) month = `0${month}`;

    return `${year}-${month}`;
  };

  const getCurrYearDate = () => {
    if (!currDate || currDate.toString().length !== 4) return new Date();

    return new Date(currDate, 1, 1);
  };

  useEffect(() => {
    if (selectedTab || selectedTab === 0) {
      let currDateVal = null;

      switch (selectedTab) {
        case sidebarData[0].id:
          currDateVal = getCurrDailyDate();
          if (currDateVal) {
            setCurrDate(currDateVal);
            datePickerRef.current.value = currDateVal;
          }
          break;
        case sidebarData[1].id:
          currDateVal = getCurrMonthDate();
          if (currDateVal) {
            setCurrDate(currDateVal);
            datePickerRef.current.value = currDateVal;
          }
          break;
        case sidebarData[2].id:
          currDateVal = getCurrDailyDate();
          if (currDateVal) {
            setCurrDate(currDateVal);
          }
        default:
          break;
      }
    }
  }, [selectedTab, window.location.href]);

  const preDate = () => {
    let url = null,
      preDate = null;

    if (currDate) {
      switch (selectedTab) {
        case sidebarData[0].id:
          preDate = getPreDate(new Date(currDate));
          url = `/daily/${getFormatDateForDatePicker(preDate)}`;
          break;
        case sidebarData[1].id:
          preDate = getPreMonth(new Date(currDate));
          url = `/monthly/?month=${
            preDate.getMonth() + 1
          }&year=${preDate.getFullYear()}`;
          break;
        case sidebarData[2].id:
          preDate = Number(currDate) - 1;
          url = `/years/${preDate}`;
        default:
          break;
      }

      history.push(url);
    }
  };

  const nextDate = () => {
    let url = null,
      nextDate = null;

    if (currDate) {
      switch (selectedTab) {
        case sidebarData[0].id:
          nextDate = getNextDate(new Date(currDate));
          url = `/daily/${getFormatDateForDatePicker(nextDate)}`;
          break;
        case sidebarData[1].id:
          nextDate = getNextMonth(new Date(currDate));
          url = `/monthly/?month=${
            nextDate.getMonth() + 1
          }&year=${nextDate.getFullYear()}`;
          break;
        case sidebarData[2].id:
          nextDate = Number(currDate) + 1;
          url = `/years/${nextDate}`;
        default:
          break;
      }

      history.push(url);
    }
  };

  const handleDatePicker = () => {
    if (datePickerRef.current.value) {
      let selectedDate = new Date(datePickerRef.current.value),
        url = null;

      switch (selectedTab) {
        case sidebarData[0].id:
          url = `/daily/${getFormatDateForDatePicker(selectedDate)}`;
          break;
        case sidebarData[1].id:
          url = `/monthly/?month=${
            selectedDate.getMonth() + 1
          }&year=${selectedDate.getFullYear()}`;
          break;
        case sidebarData[2].id:
          url = `/years/${selectedDate.getFullYear()}`;
        default:
          break;
      }

      if (url) history.push(url);
    }
  };

  const handleReactDatePicker = (date) => {
    if (!date) return;
    history.push(`/years/${date.getFullYear()}`);
  };
  // #region Function

  return (
    <div className="navigator">
      <CustomButton
        customClass="navigator__button"
        callback={() => preDate()}
        disabled={!currDate}
      >
        <i className="fas fa-angle-left"></i>
      </CustomButton>
      {selectedTab !== sidebarData[2].id && (
        <input
          className="form-control navigator__date-picker"
          type={selectedTab === sidebarData[1].id ? "month" : "date"}
          ref={datePickerRef}
          onChange={handleDatePicker}
          autoComplete={"off"}
        />
      )}

      {selectedTab === sidebarData[2].id && (
        <div>
          <DatePicker
            id="DatePicker"
            type="string"
            className="form-control navigator__react-datepicker"
            selected={getCurrYearDate()}
            onChange={(date) => handleReactDatePicker(date)}
            showYearPicker
            dateFormat="yyyy"
            yearItemNumber={9}
            required
            autoComplete="off"
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
  );
}
