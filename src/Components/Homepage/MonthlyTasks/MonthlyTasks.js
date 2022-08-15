import { Timestamp } from "firebase/firestore";
import React, { useCallback, useEffect, useRef, useState } from "react";
import { useHistory, useLocation, useParams } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberToCurrency, getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import {
  getFirstDayOfMonth,
  getFormatDateForDatePicker,
  getLastDayOfMonth,
} from "../../../Helpers/DateHelper";
import { useHomeController } from "../../HomeContext";
import Summary from "../Summary/Summary";
import "./monthly-task.css";

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
      loadTaskByMonthAsync(month, year).then(() => {
        setLoading(false);
      });
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
    }
  }, [locations]);

  const loadTaskByMonthAsync = async (month, year) => {
    if (month) month = Number(month) - 1;

    let firstDayOfMonth = getFirstDayOfMonth(month, year);
    let lastDayOfMonth = getLastDayOfMonth(month, year);

    let tasks = await getDocumentsByPagination({
      params: [
        { key: Tasks.formatedDate, operator: ">=", value: firstDayOfMonth },
        { key: Tasks.formatedDate, operator: "<=", value: lastDayOfMonth },
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
      if (!groups[task.date]) {
        groups[task.date] = { expense: 0, income: 0, total: 0 };
      }

      let amount = parseFloat(task.amount);
      if (
        task.currency !== localCountryInfo.currency &&
        rates[task.currency]
      ) {
        amount = amount / parseFloat(rates[task.currency]);
      }

      if (task.type.id === taskModes.Expense.id) groups[task.date].expense = parseFloat(groups[task.date].expense) + amount;
      if (task.type.id === taskModes.Income.id) groups[task.date].income = parseFloat(groups[task.date].income) + amount;

      groups[task.date].total = parseFloat(groups[task.date].income) - parseFloat(groups[task.date].expense);

      return groups;
    }, {})

    let groupsArray = Object.keys(groups).map(key => {
      return {
        date: key,
        ...groups[key]
      }
    })

    groupsArray = groupsArray.sort(function (a, b) {
      a = new Date(a.date);
      b = new Date(b.date);

      if (a < b) return -1;
      if (a > b) return 1;

      return 0;
    })

    setDisplayedTasks(groupsArray);
  }

  const handleRedirectToDailyTasks = (date, e) => {
    e.stopPropagation();

    if(!date) return;

    date = new Date(date);
    history.push(`/daily/${getFormatDateForDatePicker(date)}`);
  }

  return (
    <div className="daily">
      <Summary expenseTotal={expenseTotal} incomeTotal={incomeTotal} />

      <div className="task-table__wrapper">
        <table className="table task-table">
          <tbody>
            {displayedTasks && displayedTasks.map(task => {
              return (
                <tr
                  className="task-table__row"
                  key={task.date}
                  onClick={e => handleRedirectToDailyTasks(task.date, e)}
                >
                  <td className="text-start">
                    {new Date(task.date).toLocaleDateString()}
                  </td>
                  <td className="text-end">
                    <span className="text-success">+ {convertNumberToCurrency(localCountryInfo.currency, task.income)}</span>
                  </td>
                  <td>
                    <div className="d-flex flex-column text-end">
                      <span className="text-danger">- {convertNumberToCurrency(localCountryInfo.currency, task.expense)}</span>
                      <span className="text-secondary small">Total: {convertNumberToCurrency(localCountryInfo.currency, task.total)}</span>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
