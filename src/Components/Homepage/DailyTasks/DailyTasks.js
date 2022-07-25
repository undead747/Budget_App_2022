import React, { useEffect, useRef, useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberToCurrency, getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import {
  getFormatDateForDatePicker,
  getFormatDateParam,
} from "../../../Helpers/DateHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";
import Summary from "../Summary/Summary";
import "./daily-task.css";

export default function DailyTasks() {
  const param = useParams();
  const history = useHistory();
  const [tasks, setTasks] = useState([]);
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    handleConfirmShow,
    handleConfirmClose,
    setConfirmModalContent,
    localCountryInfo,
    setLoading
  } = useHomeController();
  const { getDocumentsByPagination, deleteDocument } = useFirestore(DatabaseCollections.Tasks);
  const loadDataFlag = useRef(false);
  const [incomeTotal, setIncomeTotal] = useState(Number(0).toFixed(2));
  const [expenseTotal, setExpenseTotal] = useState(Number(0).toFixed(2));

  useEffect(() => {
    if (!param.date && param.date !== 0) {
      history.push(`/daily/${getFormatDateForDatePicker()}`);
    }
  }, [param.date]);

  useEffect(() => {
    try {
      if (param.date && tasks.length === 0 && !loadDataFlag.current) {
        loadDataFlag.current = true;

        setLoading(true);
        getDocumentsByPagination({ params: { [Tasks.date]: param.date } })
          .then((data) => {
            setTasks(data);
          })
      }
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
      setLoading(false);
      loadDataFlag.current = false;
    }
  }, [param.date]);

  const displayIncomeTable = () => {
    if (!tasks || tasks.length === 0) return

    let incomeTasks = tasks.filter(task => task.type.id === taskModes.Income.id);

    if (incomeTasks.length === 0) return

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
                {displayMoneyAmmount(null, incomeTotal)}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            incomeTasks.map(task => {
              return <tr className="task-table__row" key={task.id} onClick={() => handleEditTask(task.id)}>
                <td className="text-start">{task.taskcate && task.taskcate.name}</td>
                <td className="text-start">{task.accountcate && task.accountcate.name}</td>
                <td className="text-end fw-bolder">+ {displayMoneyAmmount(task.currency, task.amount)}</td>
                <td><CustomButton callback={() => handleDeleteTask(task.id)}><i className="fas fa-trash"></i></CustomButton></td>
              </tr>
            })
          }
        </tbody>
      </table>
    )
  }

  const displayExpenseTable = () => {
    if (!tasks || tasks.length === 0) return

    let expenseTasks = tasks.filter(task => task.type.id === taskModes.Expense.id);

    if (expenseTasks.length === 0) return

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
                {displayMoneyAmmount(null, expenseTotal)}
              </span>
            </th>
          </tr>
        </thead>
        <tbody>
          {
            expenseTasks.map(task => {
              return <tr className="task-table__row" key={task.id} onClick={() => handleEditTask(task.id)}>
                <td className="text-start">{task.taskcate && task.taskcate.name}</td>
                <td className="text-start">{task.accountcate && task.accountcate.name}</td>
                <td className="text-end fw-bolder">- {displayMoneyAmmount(task.currency, task.amount)}</td>
                <td><CustomButton callback={() => handleDeleteTask(task.id)}><i className="fas fa-trash"></i></CustomButton></td>
              </tr>
            })
          }
        </tbody>
      </table>
    )
  }

  useEffect(() => {
    if (localCountryInfo && tasks) {
      getCurrencyRateByCode(localCountryInfo.currency).then(rates => {
        let incomeTotal = tasks.filter(task => task.type.id === taskModes.Income.id).reduce((total, task) => {
          let amount = Number(task.amount);
          if (task.currency !== localCountryInfo.currency && rates[task.currency]) {
            amount = amount * Number(rates[task.currency]);
          }

          return total += amount;
        }, 0)

        setIncomeTotal(incomeTotal);

        let expenseTotal = tasks.filter(task => task.type.id === taskModes.Expense.id).reduce((total, task) => {
          let amount = task.amount;
          if (task.currency !== localCountryInfo.currency && rates[task.currency]) {
            amount = amount * Number(rates[task.currency]);
          }

          return total += amount;
        }, 0)

        setExpenseTotal(expenseTotal);
      })
    }
  }, [localCountryInfo, tasks])

  const displayMoneyAmmount = (currency, amount) => {
    if (!currency && localCountryInfo) return convertNumberToCurrency(localCountryInfo.currency, amount);

    if (!currency && !amount && amount !== 0) return;

    return convertNumberToCurrency(currency, amount);
  }

  const handleDeleteTask = (taskId) => {
    try {
      setConfirmModalContent("are you sure to delete this task ? ");
      handleConfirmShow(async () => {
        setLoading(true);
        await deleteDocument(taskId);
        let tasks = await getDocumentsByPagination({ params: { [Tasks.date]: param.date } });
        setTasks(tasks);
        setLoading(false);
      })
    } catch (err) {
      setErrorModalContent(JSON.stringify(err));
      handleErrorShow();
    }
  }

  const handleEditTask = (taskId) =>{
    history.push(`/task/edit/${taskId}`);
  }

  return (
    <div className="daily">
      <Summary expenseTotal={expenseTotal} incomeTotal={incomeTotal} displayMoneyAmmount={displayMoneyAmmount} />
      {displayIncomeTable()}
      {displayExpenseTable()}
    </div>
  );
}
