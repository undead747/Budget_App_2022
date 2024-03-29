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
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
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
  const {
    getDocumentsByPagination: getTransfersByPagination,
    deleteDocument: deleteTransfer,
  } = useFirestore(DatabaseCollections.Transfer);
  const {
    getDocumentById: getBudgetById,
    addDocumentWithId: addBudget,
    updateDocument: updateBudget,
  } = useFirestore(DatabaseCollections.Budgets);
  // getting data from Flag, use for saving firebase-read operation
  const loadDataFlag = useRef(false);

  const [tasks, setTasks] = useState([]);
  const [transfers, setTransfers] = useState([]);
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
    getTasksByDate(param.date);
    getTransferByDate(param.date);
  }, [param.date]);

  const getTasksByDate = async (dateParam) => {
    try {
      if (dateParam && tasks.length === 0 && !loadDataFlag.current) {
        loadDataFlag.current = true;

        setLoading(true);

        const tasks = await getDocumentsByPagination({
          params: [{ key: Tasks.date, operator: "==", value: dateParam }],
        });

        setTasks(tasks);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    } finally {
      setLoading(false);
      loadDataFlag.current = false;
    }
  };

  const getTransferByDate = async (dateParam) => {
    try {
      if (dateParam && transfers.length === 0) {
        setLoading(true);

        const transfers = await getTransfersByPagination({
          params: [{ key: Tasks.date, operator: "==", value: dateParam }],
        });

        setTransfers(transfers);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

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
      <div className="task-table__wrapper--daily-task">
        <table className="table task-table">
          <thead>
            <tr className="task-table__header">
              <th className="task-table__header-title text-nowrap">
                <i className="fas fa-long-arrow-alt-up"></i>Income
              </th>
              <th></th>
              <th className="text-end text-nowrap">
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
                  <td className="text-start text-nowrap">
                    {task.taskCate && task.taskCate.name}
                  </td>
                  <td className="text-start text-nowrap">
                    <div className="task-table__row-title">
                      <span>{task.accountCate && task.accountCate.name}</span>
                      <span className="opacity-75">
                        {task.title && task.title}
                        {task.note && `(${task.note})`}
                      </span>
                    </div>
                  </td>
                  <td className="text-end fw-bolder text-nowrap">
                    + {convertNumberToCurrency(task.currency, task.amount)}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end align-items-center">
                      <CustomButton callback={(e) => handleDeleteTask(task, e)}>
                        <i className="fas fa-trash"></i>
                      </CustomButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
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
      <div className="task-table__wrapper--daily-task">
        <table className="table task-table">
          <thead>
            <tr className="task-table__header text-nowrap">
              <th className="task-table__header-title">
                <i className="fas fa-long-arrow-alt-down"></i>Expense
              </th>
              <th></th>
              <th className="text-end text-nowrap">
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
                  <td className="text-start text-nowrap">
                    {task.taskCate && task.taskCate.name}
                  </td>
                  <td className="text-start text-nowrap">
                    <div className="task-table__row-title">
                      <span>{task.accountCate && task.accountCate.name}</span>
                      <span className="opacity-75">
                        {task.title && task.title}
                        {task.note && `(${task.note})`}
                      </span>
                    </div>
                  </td>
                  <td className="text-end fw-bolder text-nowrap">
                    - {convertNumberToCurrency(task.currency, task.amount)}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end align-items-center">
                      <CustomButton callback={(e) => handleDeleteTask(task, e)}>
                        <i className="fas fa-trash"></i>
                      </CustomButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
  };

  /**
   * Display tasks with expense type.
   */
  const displayTransferTable = () => {
    if (!transfers || transfers.length === 0) return;

    return (
      <div className="task-table__wrapper--daily-task">
        <table className="table task-table">
          <thead>
            <tr className="task-table__header text-nowrap">
              <th className="task-table__header-title">
                <i className="fas fa-long-arrow-alt-down"></i>Transfer
              </th>
              <th></th>
              <th className="text-end text-nowrap">
                <span className="text-danger"></span>
              </th>
            </tr>
          </thead>
          <tbody>
            {transfers.map((transfer) => {
              return (
                <tr
                  className="task-table__row"
                  key={transfer.id}
                >
                  <td className="text-start text-nowrap">
                    <span className="me-2">
                      {transfer.fromIncomeCate && transfer.fromIncomeCate.name}
                    </span>
                    <i className="fa fa-arrow-right me-2"></i>
                    {transfer.toIncomeCate && transfer.toIncomeCate.name}
                  </td>
                  <td className="text-start text-nowrap opacity-75">
                    {transfer.note && transfer.note}
                  </td>
                  <td className="text-end fw-bolder text-nowrap">
                    -{" "}
                    {convertNumberToCurrency(
                      transfer.currency,
                      transfer.amount
                    )}
                  </td>
                  <td>
                    <div className="d-flex justify-content-end align-items-center">
                      <CustomButton
                        callback={(e) => handleDeleteTransfer(transfer, e)}
                      >
                        <i className="fas fa-trash"></i>
                      </CustomButton>
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    );
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
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  /**
   * Handle delete task  event.
   * @param {string} taskId - delete task ID.
   * @param {object} e - triggered delete button.
   */
  const handleDeleteTask = async (task, e) => {
    e.stopPropagation();

    setConfirmModalContent("are you sure to delete this task ? ");

    handleConfirmShow(async () => {
      try {
        setLoading(true);
        await deleteDocument(task.id);
        setLoading(false);

        let filterTasks = tasks.filter(itm => itm.id !== task.id);
        setTasks(filterTasks);

        let rates = await getCurrencyRateByCode(localCountryInfo.currency);
        let amount = parseFloat(task.amount);

        if (
          task.currency !== localCountryInfo.currency &&
          rates[task.currency]
        ) {
          amount = amount / parseFloat(rates[task.currency]);
        }

        let budget = await getBudgetById(task.accountCate.id);

        if (task.type.id === taskModes.Income.id) {
          if (budget && budget.data) {
            let calAmount = parseFloat(budget.data.amount) - amount;
            await updateBudget(
              { ...budget.data, amount: calAmount },
              budget.id
            );
          }
        }

        if (task.type.id === taskModes.Expense.id) {
          if (budget && budget.data) {
            let calAmount = parseFloat(budget.data.amount) + amount;
            await updateBudget(
              { ...budget.data, amount: calAmount },
              budget.id
            );
          }
        }
      } catch (err) {
        setErrorModalContent(err.message);
        handleErrorShow();
      } finally {
        setLoading(false);
      }
    });
  };

  /**
   * Handle delete task  event.
   * @param {string} taskId - delete task ID.
   * @param {object} e - triggered delete button.
   */
  const handleDeleteTransfer = async (transfer, e) => {
    e.stopPropagation();

    setConfirmModalContent("are you sure to delete this transfer ? ");

    handleConfirmShow(async () => {
      try {
        setLoading(true);
        await deleteTransfer(transfer.id);
        setLoading(false);

        let filterTransfers = transfers.filter(item => item.id !== transfer.id);
        setTransfers(filterTransfers);

        let amount = parseFloat(transfer.amount);
        let rates = await getCurrencyRateByCode(localCountryInfo.currency);
        if (
          transfer.currency !== localCountryInfo.currency &&
          rates[transfer.currency]
        ) {
          amount = amount / parseFloat(rates[transfer.currency]);
        }
        
        let fromCateBudget = await getBudgetById(transfer.fromIncomeCate.id);
        let toCateBudget = await getBudgetById(transfer.toIncomeCate.id);

        let calAmount = parseFloat(fromCateBudget.data.amount) + amount;
        await updateBudget(
          { ...fromCateBudget.data, amount: calAmount },
          fromCateBudget.id
        );

        calAmount = parseFloat(toCateBudget.data.amount) - amount;
        if(toCateBudget && toCateBudget.data){
          await updateBudget(
            { ...toCateBudget.data, amount: calAmount },
            toCateBudget.id
          );
        }
      } catch (err) {
        setErrorModalContent(err.message);
        handleErrorShow();
      } finally {
        setLoading(false);
      }
    });
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
      <div className="mb-3">{displayIncomeTable()}</div>
      <div>{displayExpenseTable()}</div>
      {displayTransferTable()}
    </div>
  );
}
