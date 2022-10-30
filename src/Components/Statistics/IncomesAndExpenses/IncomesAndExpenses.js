import React, { useEffect, useRef, useState } from "react";
import DropdownMode from "./DropdownMode";
import Navigator from "./Navigator";
import "./income-expense.css";
import ToggleTaskMode from "./ToggleTaskMode";
import { StatisticsMode, useStatistics } from "../StatisticsContext";
import { useHistory } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "../../../Helpers/DateHelper";
import { useHomeController } from "../../HomeContext";
import { TaskChart } from "../Chart/Chart";

export default function IncomesAndExpenses() {
  const { currDate, taskMode, statisticsMode } = useStatistics();
  const [incomeTasks, setIncomeTasks] = useState();
  const [expenseTasks, setExpenseTasks] = useState();
  const history = useHistory();
  const loadDataFlag = useRef(false);

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    setLoading,
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
  } = useHomeController();

  // Database method
  const { getDocumentsByPagination } = useFirestore(DatabaseCollections.Tasks);

  useEffect(() => {
    if (!currDate || !statisticsMode || !taskMode) {
      const date = new Date();
      let month = date.getMonth() + 1;
      if (month.toString().length === 1) month = `0${month}`;
      history.push(
        `/statistics?taskMode=${taskModes.Income.param}&statisticsMode=${
          StatisticsMode.ByMonth.name
        }&month=${month}&year=${date.getFullYear()}`
      );
      return;
    }

    switch (statisticsMode) {
      case StatisticsMode.ByMonth.name:
        loadTasksByMonth();
        break;
      case StatisticsMode.ByYear.name:
        loadTasksByYear();
        break;
      default:
        break;
    }
  }, [currDate, taskMode, statisticsMode]);

  const loadTasksByMonth = async () => {
    try {
      if (loadDataFlag.current === false) {
        loadDataFlag.current = true;

        const currDateVal = new Date(currDate);

        let firstDayOfMonth = getFirstDayOfMonth(
          currDateVal.getMonth(),
          currDateVal.getFullYear()
        );
        let lastDayOfMonth = getLastDayOfMonth(
          currDateVal.getMonth(),
          currDateVal.getFullYear()
        );

        setLoading(true);
        let tasks = await getDocumentsByPagination({
          params: [
            { key: Tasks.formatedDate, operator: ">=", value: firstDayOfMonth },
            { key: Tasks.formatedDate, operator: "<=", value: lastDayOfMonth },
          ],
        });
        setLoading(false);
        loadDataFlag.current = false;

        let expenseTasks = tasks.filter(
          (task) => task.type.id === taskModes.Expense.id
        );

        let incomeTasks = tasks.filter(
          (task) => task.type.id === taskModes.Income.id
        );

        setExpenseTasks(expenseTasks);
        setIncomeTasks(incomeTasks);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const loadTasksByYear = async () => {
    try {
      if (loadDataFlag.current === false) {
        loadDataFlag.current = true;

        const currDateVal = new Date(currDate);
        const firstMonthOfYear = 0;
        const lastMonthOfYear = 11;

        let firstDayOfFirstMonth = getFirstDayOfMonth(
          firstMonthOfYear,
          currDateVal.getFullYear()
        );
        let lastDayOfLastMonth = getLastDayOfMonth(
          lastMonthOfYear,
          currDateVal.getFullYear()
        );

        setLoading(true);
        let tasks = await getDocumentsByPagination({
          params: [
            {
              key: Tasks.formatedDate,
              operator: ">=",
              value: firstDayOfFirstMonth,
            },
            {
              key: Tasks.formatedDate,
              operator: "<=",
              value: lastDayOfLastMonth,
            },
          ],
        });
        setLoading(false);
        loadDataFlag.current = false;

        let expenseTasks = tasks.filter(
          (task) => task.type.id === taskModes.Expense.id
        );

        let incomeTasks = tasks.filter(
          (task) => task.type.id === taskModes.Income.id
        );

        setExpenseTasks(expenseTasks);
        setIncomeTasks(incomeTasks);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  return (
    <div className="incomesAndExpenses">
      <div className="incomesAndExpenses__Header">
        <div className="container">
          <div className="incomesAndExpenses__Dropdown">
            <DropdownMode />
          </div>
          <Navigator />
          <ToggleTaskMode />
        </div>
      </div>
      <div className="incomesAndExpenses__Chart">
        {taskMode === taskModes.Income.param && (
          <TaskChart tasks={incomeTasks} />
        )}
        {taskMode === taskModes.Expense.param && (
          <TaskChart tasks={expenseTasks} />
        )}
      </div>
    </div>
  );
}
