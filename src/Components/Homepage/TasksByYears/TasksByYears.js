import React, { useEffect, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  DatabaseCollections,
  TaskTotalDocId,
  useFirestore,
} from "../../../Database/useFirestore";
import { useHomeController } from "../../HomeContext";
import {
  getFirstDayOfMonth,
  getFormatDateForDatePicker,
  getLastDayOfMonth,
} from "../../../Helpers/DateHelper";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  convertNumberToCurrency,
  getCurrencyRateByCode,
} from "../../../Helpers/CurrencyHelper";
import Summary from "../Summary/Summary";

export default function TasksByYears() {
  // #region State
  const param = useParams();
  const history = useHistory();

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
  const { getDocumentsByPagination } = useFirestore(DatabaseCollections.Tasks);
  const [tasks, setTasks] = useState([]);
  const [displayedTasks, setDisplayedTasks] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(parseFloat(0).toFixed(2));
  const [expenseTotal, setExpenseTotal] = useState(parseFloat(0).toFixed(2));

  // Redirect to current date tab if URL don't have date param
  useEffect(() => {
    const year = param.date;
    if (!year && year !== 0) {
      const date = new Date();

      history.push(`/years/${date.getFullYear()}`);
      return;
    }

    loadTaskByYearAsync(year);
  }, [param.date]);

  const loadTaskByYearAsync = async (year) => {
    try {
      let firstDayOfYear = getFirstDayOfMonth(0, year);
      let lastDayOfYear = getLastDayOfMonth(11, year);

      setLoading(true);
      let tasks = await getDocumentsByPagination({
        params: [
          { key: Tasks.formatedDate, operator: ">=", value: firstDayOfYear },
          { key: Tasks.formatedDate, operator: "<=", value: lastDayOfYear },
        ],
      });

      setTasks(tasks);
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

  /**
   * Calculating total income and expense.
   * Change incomeTotal and expenseTotal value
   */
  useEffect(() => {
    calculateTotal(localCountryInfo, tasks);
  }, [localCountryInfo, tasks]);

  const calculateTotal = async (localCountryInfo, tasks) => {
    try {
      if (localCountryInfo && tasks) {
        const rates = await getCurrencyRateByCode(localCountryInfo.currency);

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
        groupTasksByMonth(tasks, localCountryInfo, rates);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const groupTasksByMonth = (tasks, localCountryInfo, rates) => {
    const groups = tasks.reduce((groups, task) => {
      const month = new Date(task.date).getMonth() + 1;
      const year = new Date(task.date).getFullYear();
      const date = `${month}/${year}`;

      if (!groups[date]) {
        groups[date] = { expense: 0, income: 0, total: 0, date: task.date };
      }

      let amount = parseFloat(task.amount);
      if (task.currency !== localCountryInfo.currency && rates[task.currency]) {
        amount = amount / parseFloat(rates[task.currency]);
      }

      if (task.type.id === taskModes.Expense.id)
        groups[date].expense = parseFloat(groups[date].expense) + amount;
      if (task.type.id === taskModes.Income.id)
        groups[date].income = parseFloat(groups[date].income) + amount;

      groups[date].total =
        parseFloat(groups[date].income) - parseFloat(groups[date].expense);

      return groups;
    }, {});

    let groupsArray = Object.keys(groups).map((key) => {
      return {
        month: key,
        ...groups[key],
      };
    });

    groupsArray = groupsArray.sort(function (a, b) {
      a = new Date(a.month);
      b = new Date(b.month);

      if (a < b) return -1;
      if (a > b) return 1;

      return 0;
    });

    setDisplayedTasks(groupsArray);
  };

  const handleRedirectToDailyTasks = (date, e) => {
    e.stopPropagation();

    if (!date) return;

    date = new Date(date);
    const url = `/monthly/?month=${
      date.getMonth() + 1
    }&year=${date.getFullYear()}`;
    history.push(url);
  };

  return (
    <div className="daily">
      <Summary expenseTotal={expenseTotal} incomeTotal={incomeTotal} />

      <div className="task-table__wrapper">
        <table className="table task-table">
          <tbody>
            {displayedTasks &&
              displayedTasks.map((task) => {
                return (
                  <tr
                    className="task-table__row"
                    key={task.month}
                    onClick={(e) => handleRedirectToDailyTasks(task.date, e)}
                  >
                    <td className="text-start text-nowrap">{task.month}</td>
                    <td className="text-end text-nowrap">
                      <span className="text-success">
                        +{" "}
                        {convertNumberToCurrency(
                          localCountryInfo.currency,
                          task.income
                        )}
                      </span>
                    </td>
                    <td className="text-nowrap">
                      <div className="d-flex flex-column text-end">
                        <span className="text-danger">
                          -{" "}
                          {convertNumberToCurrency(
                            localCountryInfo.currency,
                            task.expense
                          )}
                        </span>
                        <span className="text-secondary small">
                          Total:{" "}
                          {convertNumberToCurrency(
                            localCountryInfo.currency,
                            task.total
                          )}
                        </span>
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
