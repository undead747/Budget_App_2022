import React, { useEffect, useRef, useState } from "react";
import { matchPath, useHistory, useLocation } from "react-router-dom";
import {
  getFormatDateForDatePicker,
  getNextDate,
  getPreDate,
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

    if(!month || !year) return;

    return `${month}-${year}`;
  } 

  useEffect(() => {
    let currDateVal = getCurrDate();
    
    if (currDateVal) {

      setCurrDate(currDateVal);
      datePickerRef.current.value = currDateVal;
    }
  }, [getCurrDate]);

  useEffect(() => {
      if(selectedTab){
        let currDateVal = null;

        switch (selectedTab) {
          case sidebarData[0].id:
            currDateVal = getCurrDailyDate();
            break;
          case sidebarData[1].id:
          default:
            break;
        }
      }
  }, [selectedTab])

  const preDate = () => {
    if (selectedTab === 0 && currDate) {
      let preDate = getPreDate(new Date(currDate));
      history.push(`/daily/${getFormatDateForDatePicker(preDate)}`);
    }
  };

  const nextDate = () => {
    if (selectedTab === 0 && currDate) {
      let nextDate = getNextDate(new Date(currDate));
      history.push(`/daily/${getFormatDateForDatePicker(nextDate)}`);
    }
  };

  const handleDatePicker = () => {
    if (selectedTab === 0 && datePickerRef.current.value) {
      let selectedDate = new Date(datePickerRef.current.value);
      history.push(`/daily/${getFormatDateForDatePicker(selectedDate)}`);
    }
  };
  // #region Function

  return (
    <div className="navigator">
      <CustomButton callback={() => preDate()} disabled={!currDate}>
        <i className="fas fa-angle-left"></i>
      </CustomButton>
      <input
        className="form-control navigator__date-picker"
        type={"date"}
        ref={datePickerRef}
        onChange={handleDatePicker}
      />
  
      <CustomButton callback={() => nextDate()} disabled={!currDate}>
        <i className="fas fa-angle-right"></i>
      </CustomButton>
    </div>
  );
}
