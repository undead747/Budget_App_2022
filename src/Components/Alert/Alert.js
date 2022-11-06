import React, { useEffect, useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { taskModes, Tasks } from "../../Constants/TaskConstaints";
import { DatabaseCollections, useFirestore } from "../../Database/useFirestore";
import { getCurrencyRateByCode } from "../../Helpers/CurrencyHelper";
import {
    checkTwoDateEqualizer,
  getFirstDayOfMonth,
  getLastDayOfMonth,
} from "../../Helpers/DateHelper";
import { useHomeController } from "../HomeContext";
import "./alert.css";

export default function Alert() {
  const [debtcount, setDebtCount] = useState();
  const [demandTotal, setDemandTotal] = useState();
  const [expenseTotal, setExpenseTotal] = useState(parseFloat(0).toFixed(2));
  const [tasks, setTasks] = useState([]);
  const [demands, setDemands] = useState();
  const history = useHistory();

  const { getDocuments: getDemands } = useFirestore(
    DatabaseCollections.Demands
  );

  const { getDocumentsByPagination: getTasksByPagination } = useFirestore(
    DatabaseCollections.Tasks
  );

  const { getDocuments : getDebts } = useFirestore(DatabaseCollections.Debts);

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    localCountryInfo,
    setLoading,
    spendLimitAlert,
    setSpendLimitAlert,
    debtAlert,
    setDebtAlert
  } = useHomeController();

  useEffect(() => {
    loadDemands();
  }, []);

  /**
   * Calculating total income and expense.
   * Change incomeTotal and expenseTotal value
   */
  useEffect(() => {
    calculateDemandsTotal(localCountryInfo, demands);
  }, [localCountryInfo, demands]);

  useEffect(() => {
    let currMonth = new Date().getMonth() + 1;
    let currYear = new Date().getFullYear();

    loadTaskByMonthAsync(currMonth, currYear);
  }, []);

  /**
   * Calculating total income and expense.
   * Change incomeTotal and expenseTotal value
   */
  useEffect(() => {
    calculateTasksTotal(localCountryInfo, tasks);
  }, [localCountryInfo, tasks]);

  useEffect(() => {
    if (Number(expenseTotal) > Number(demandTotal)) setSpendLimitAlert(true);
  }, [demandTotal, expenseTotal]);

  useEffect(() => {
    loadDebts();
  }, []);

  const closeSpendingAlert = () => setSpendLimitAlert(false);
  const closeDebtAlert = () => setDebtAlert(false);

  const loadDebts = async () => {
    try {
      setLoading(true);
      let debts = await getDebts();
      setLoading(false);

      if(debts){
          const debtCount = debts.filter(debt => checkTwoDateEqualizer(debt.data.formatedDeadline.toDate(), new Date()));
          if(debtCount.length > 0){
            setDebtCount(debtCount.length);
            setDebtAlert(true);
          }
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const calculateDemandsTotal = async (localCountryInfo, demands) => {
    try {
      if (localCountryInfo && demands) {
        const rates = await getCurrencyRateByCode(localCountryInfo.currency);

        let total = demands.reduce((total, demand) => {
          demand = demand.data;
          let amount = parseFloat(demand.amount);
          if (
            demand.currency !== localCountryInfo.currency &&
            rates[demand.currency]
          ) {
            amount = amount / parseFloat(rates[demand.currency]);
          }

          return (total += amount);
        }, 0);

        setDemandTotal(total);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const loadDemands = async () => {
    try {
      setLoading(true);
      let demands = await getDemands();
      setLoading(false);

      if (demands) {
        setDemands(demands);

        let total = parseFloat(0);
        demands.forEach((demand) => {
          total += parseFloat(demand.data.value);
        });

        setDemandTotal(total);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const calculateTasksTotal = async (localCountryInfo, tasks) => {
    try {
      if (localCountryInfo && tasks) {
        const rates = getCurrencyRateByCode(localCountryInfo.currency);
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

  // Redirect to current date tab if URL don't have date param

  const loadTaskByMonthAsync = async (month, year) => {
    try {
      if (month) month = Number(month) - 1;

      let firstDayOfMonth = getFirstDayOfMonth(month, year);
      let lastDayOfMonth = getLastDayOfMonth(month, year);

      setLoading(true);
      let tasks = await getTasksByPagination({
        params: [
          { key: Tasks.formatedDate, operator: ">=", value: firstDayOfMonth },
          { key: Tasks.formatedDate, operator: "<=", value: lastDayOfMonth },
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

  return (
    <div className="alert-bar">
        {spendLimitAlert && (
          <div className="alert alert-danger alert-dismissible fade show pe-3" role="alert">
            <div className="container">
                You have reached this month's spending limit! <span className="link-danger"><Link to={'/budgets/spendinglimit'} className="link-danger">Click here</Link></span> for more details. 
                <button type="button" className="btn-close" onClick={closeSpendingAlert}></button>
            </div>
          </div>
        )}
        {debtAlert && (
          <div className="alert alert-danger alert-dismissible fade show pe-3" role="alert">
            <div className="container">
              You have <strong>{debtcount}</strong> overdue debts. <span className="link-danger"><Link to={'/budgets/debts'} className="link-danger">Click here</Link></span> for more details. 
              <button type="button" className="btn-close" onClick={closeDebtAlert}></button>
            </div>
          </div>
        )}
    </div>
  );
}
