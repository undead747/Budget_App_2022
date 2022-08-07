import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import {
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "../../../Helpers/DateHelper";
import { useHomeController } from "../../HomeContext";
import Summary from "../Summary/Summary";

export default function MonthlyTasks() {
  // #region State
  const history = useHistory();
  const locations = useLocation();

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    handleConfirmShow,
    handleConfirmClose,
    setConfirmModalContent,
    localCountryInfo,
    setLoading,
  } = useHomeController();

  // Database method
  const { getDocumentsByPagination } = useFirestore(
    DatabaseCollections.Tasks
  );

  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(parseFloat(0).toFixed(2));
  const [expenseTotal, setExpenseTotal] = useState(parseFloat(0).toFixed(2));

  // Redirect to current date tab if URL don't have date param
  useEffect(() => {
    try {
      const search = locations.search;

      const month = new URLSearchParams(search).get("month");
      const year = new URLSearchParams(search).get("year");

      if (!month || !year) {
        let currMonth = new Date().getMonth() + 1;
        let currYear = new Date().getFullYear();

        history.push(`/monthly?month=${currMonth}&year=${currYear}`);
        return;
      }

      setLoading(true);
      loadTaskByMonthAsync();
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  }, [locations]);

  const loadTaskByMonthAsync = async (month, year) => {
    let firstDayOfMonth = getFirstDayOfMonth(month, year);
    let lastDayOfMonth = getLastDayOfMonth(month, year);

    let tasks = await getDocumentsByPagination({
      params: [
        { key: Tasks.createAt, operator: ">=", value: firstDayOfMonth },
        { key: Tasks.createAt, operator: "<=", value: lastDayOfMonth },
      ],
    });

    setTasks(tasks);
  };

  /**
   * Calculating total income and expense.
   * Change incomeTotal and expenseTotal value
   */
  useEffect(() => {
    if (localCountryInfo && tasks) {
      getCurrencyRateByCode(localCountryInfo.currency).then((rates) => {
        let incomeTotal = tasks
          .filter((task) => task.type.id === taskModes.Income.id)
          .reduce((total, task) => {
            let amount = parseFloat(task.amount);
            if (
              task.currency !== localCountryInfo.currency &&
              rates[task.currency]
            ) {
              amount = amount / parseFloat(rates[task.currency]);
            }

            return (total += amount);
          }, 0);

        setIncomeTotal(incomeTotal);

        let expenseTotal = tasks
          .filter((task) => task.type.id === taskModes.Expense.id)
          .reduce((total, task) => {
            let amount = parseFloat(task.amount);
            if (
              task.currency !== localCountryInfo.currency &&
              rates[task.currency]
            ) {
              amount = amount / parseFloat(rates[task.currency]);
            }

            return (total += amount);
          }, 0);

        setExpenseTotal(expenseTotal);

        groupTasksByDate(tasks, localCountryInfo, rates);
      });
    }
  }, [localCountryInfo, tasks]);

  const groupTasksByDate = (tasks, localCountryInfo, rates) => {
      const groups = tasks.reduce((groups, task) => {
          if(!groups[task.date]){
              groups[task.date] = {expenseTotal: 0, incomeTotal: 0};
          }

          let amount = parseFloat(task.amount);
            if (
              task.currency !== localCountryInfo.currency &&
              rates[task.currency]
            ) {
              amount = amount / parseFloat(rates[task.currency]);
            }

          groups[task.date].expenseTotal = parseFloat(groups[task.date].expenseTotal) + amount;   
          groups[task.date].incomeTotal = parseFloat(groups[task.date].incomeTotal) + amount;
          
          return groups;
      }, {})
      
      setDisplayedTasks(groups);
  }

  const displayTasksTable = useCallback(() => {
    if (!tasks || tasks.length === 0) return;

    
  }, [tasks])

  return (
    <div className="daily">
      <Summary expenseTotal={expenseTotal} incomeTotal={incomeTotal} />
      {displayTasksTable()}
    </div>
  );
}
