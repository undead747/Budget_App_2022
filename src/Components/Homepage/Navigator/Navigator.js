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
    let month = params.get('month');
    let year = params.get('year');

    if (!month || !year) return;

    if (month.length === 1) month = `0${month}`;

    return `${year}-${month}`;
  }

  useEffect(() => {
    if (selectedTab || selectedTab === 0) {
      let currDateVal = null;

      switch (selectedTab) {
        case sidebarData[0].id:
          currDateVal = getCurrDailyDate();
          break;
        case sidebarData[1].id:
          currDateVal = getCurrMonthDate();
          break;
        default:
          break;
      }

      if(!currDateVal) return;
      
      setCurrDate(currDateVal);
      datePickerRef.current.value = currDateVal;
    }
  }, [selectedTab, window.location.href])

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
          url = `/monthly/?month=${preDate.getMonth() + 1}&year=${preDate.getFullYear()}`
          break;
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
        url = `/monthly/?month=${nextDate.getMonth() + 1}&year=${nextDate.getFullYear()}`
        break;
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
          url = `/daily/${getFormatDateForDatePicker(nextDate)}`;
          break;
        case sidebarData[1].id:
          url = `/monthly/?month=${selectedDate.getMonth() + 1}&year=${selectedDate.getFullYear()}`
          break;
        default:
          break;
      }

      if(url) history.push(url);
    }
  };
  // #region Function

  return (
    <div className="navigator">
      <CustomButton customClass="navigator__button" callback={() => preDate()} disabled={!currDate}>
        <i className="fas fa-angle-left"></i>
      </CustomButton>
      <input
        className="form-control navigator__date-picker"
        type={selectedTab === sidebarData[1].id ? "month" : "date"}
        ref={datePickerRef}
        onChange={handleDatePicker}
      />

      <CustomButton customClass="navigator__button" callback={() => nextDate()} disabled={!currDate}>
        <i className="fas fa-angle-right"></i>
      </CustomButton>
    </div>
  );
}
