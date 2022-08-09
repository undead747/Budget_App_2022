import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import {
  convertNumberToCurrency,
  getCurrencyRateByCode,
} from "../../../Helpers/CurrencyHelper";
import {
  getFormatDateForDatePicker,
} from "../../../Helpers/DateHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";
import Summary from "../Summary/Summary";
import "./daily-task.css";

export default function DailyTasks() {
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
  const { getDocumentsByPagination, deleteDocument } = useFirestore(
    DatabaseCollections.Tasks
  );
  // getting data from Flag, use for saving firebase-read operation
  const loadDataFlag = useRef(false);

  const [tasks, setTasks] = useState([]);
  const [incomeTotal, setIncomeTotal] = useState(parseFloat(0).toFixed(2));
  const [expenseTotal, setExpenseTotal] = useState(parseFloat(0).toFixed(2));

  // Redirect to current date tab if URL don't have date param
  useEffect(() => {
    if (!param.date && param.date !== 0) {
      history.push(`/daily/${getFormatDateForDatePicker()}`);
    }
  }, [param.date]);

  /**
   * Loading tasks based on url date param.
   * Change tasks value.
   */
  useEffect(() => {
    try {
      if (param.date && tasks.length === 0 && !loadDataFlag.current) {
        loadDataFlag.current = true;

        setLoading(true);

        getDocumentsByPagination({ params: [{ key: Tasks.date, operator: "==", value: param.date }] }).then(
          (data) => {
            setTasks(data)
            setLoading(false);
          }
        );
      }
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
      loadDataFlag.current = false;
    }
  }, [param.date]);

  /**
   * Display tasks with income type.
   */
  const displayIncomeTable = () => {
    if (!tasks || tasks.length === 0) return;

    let incomeTasks = tasks.filter(
      (task) => task.type.id === taskModes.Income.id
    );

    if (incomeTasks.length === 0) return;

    return (
      <table className="table task-table">
        <thead>
          <tr className="task-table__header">
            <th className="task-table__header-title">
              <i className="fas fa-long-arrow-alt-up"></i>Income
            </th>
            <th></th>
            <th className="text-end">
              <span className="text-success">
                {parseInt(incomeTotal) !== 0 && "+ "}
                {convertNumberToCurrency(
                  localCountryInfo.currency,
                  incomeTotal
                )}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {incomeTasks.map((task) => {
            return (
              <tr
                className="task-table__row"
                key={task.id}
                onClick={() => handleEditTask(task.id)}
              >
                <td className="text-start">
                  {task.taskcate && task.taskcate.name}
                </td>
                <td className="text-start">
                  {task.accountcate && task.accountcate.name}
                </td>
                <td className="text-end fw-bolder">
                  + {convertNumberToCurrency(task.currency, task.amount)}
                </td>
                <td>
                  <CustomButton callback={(e) => handleDeleteTask(task.id, e)}>
                    <i className="fas fa-trash"></i>
                  </CustomButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
  };

  /**
   * Display tasks with expense type.
   */
  const displayExpenseTable = () => {
    if (!tasks || tasks.length === 0) return;

    let expenseTasks = tasks.filter(
      (task) => task.type.id === taskModes.Expense.id
    );

    if (expenseTasks.length === 0) return;

    return (
      <table className="table task-table">
        <thead>
          <tr className="task-table__header">
            <th className="task-table__header-title">
              <i className="fas fa-long-arrow-alt-down"></i>Expense
            </th>
            <th></th>
            <th className="text-end">
              <span className="text-danger">
                {parseInt(expenseTotal) !== 0 && "- "}
                {convertNumberToCurrency(
                  localCountryInfo.currency,
                  expenseTotal
                )}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {expenseTasks.map((task) => {
            return (
              <tr
                className="task-table__row"
                key={task.id}
                onClick={() => handleEditTask(task.id)}
              >
                <td className="text-start">
                  {task.taskcate && task.taskcate.name}
                </td>
                <td className="text-start">
                  {task.accountcate && task.accountcate.name}
                </td>
                <td className="text-end fw-bolder">
                  - {convertNumberToCurrency(task.currency, task.amount)}
                </td>
                <td>
                  <CustomButton callback={(e) => handleDeleteTask(task.id, e)}>
                    <i className="fas fa-trash"></i>
                  </CustomButton>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    );
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
      });
    }
  }, [localCountryInfo, tasks]);

  /**
   * Handle delete task  event.
   * @param {string} taskId - delete task ID.
   * @param {object} e - triggered delete button.
   */
  const handleDeleteTask = (taskId, e) => {
    e.stopPropagation();

    try {
      setConfirmModalContent("are you sure to delete this task ? ");

      handleConfirmShow(async () => {
        setLoading(true);

        await deleteDocument(taskId);

        let tasks = await getDocumentsByPagination({ params: [{ key: Tasks.date, operator: "==", value: param.date }] });
        setTasks(tasks);

        setLoading(false);
      });
    } catch (err) {
      setErrorModalContent(JSON.stringify(err));
      handleErrorShow();
    }
  };

  /**
   * Handle edit task  event.
   * Redirect to edit form.
   * @param {string} taskId - delete task ID.
   */
  const handleEditTask = (taskId) => {
    history.push(`/task/edit/${taskId}`);
  };

  return (
    <div className="daily">
      <Summary expenseTotal={expenseTotal} incomeTotal={incomeTotal} />
      {displayIncomeTable()}
      {displayExpenseTable()}
    </div>
  );
}
