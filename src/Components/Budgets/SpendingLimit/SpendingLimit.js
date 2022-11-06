import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { taskModes, Tasks } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberToCurrency, getCurrencyRateByCode } from "../../../Helpers/CurrencyHelper";
import { getFirstDayOfMonth, getLastDayOfMonth } from "../../../Helpers/DateHelper";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";
import { useHomeController } from "../../HomeContext";

export default function SpendingLimit() {
  const [total, setTotal] = useState(0);
  const [demands, setDemands] = useState();
  const [expenseTotal, setExpenseTotal] = useState(parseFloat(0).toFixed(2));
  const [tasks, setTasks] = useState([]);
  const history = useHistory();

  const { getDocuments } = useFirestore(DatabaseCollections.Demands);

  const { getDocumentsByPagination: getTasksByPagination } = useFirestore(
    DatabaseCollections.Tasks
  );

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    localCountryInfo,
    setLoading,
  } = useHomeController();

  useEffect(() => {
    loadDemands();
  }, []);

  /**
   * Calculating total income and expense.
   * Change incomeTotal and expenseTotal value
   */
  useEffect(() => {
    calculateTotal(localCountryInfo, demands);
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

  const calculateTotal = async (localCountryInfo, demands) => {
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

        setTotal(total);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const loadDemands = async () => {
    try {
      setLoading(true);
      let demands = await getDocuments();
      setLoading(false);

      if (demands) setDemands(demands);
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const handleAddDemand = () => {
    history.push("/demand/add");
  };

  const handleEditDemand = (id) => history.push(`/demand/edit/${id}`);

  return (
    <>
      <div className="budget-summary d-flex justify-content-around">
        <div className="summary__item">
          <h5 className="summary__title">
            <box-icon name="coin-stack" type="solid"></box-icon>
            <span>Expend Limit</span>
          </h5>
          <h5 className="summary__val summary__val--success text-success ">
            {total && convertNumberToCurrency(localCountryInfo.currency, total)}
          </h5>
        </div>
        <div className="summary__item">
          <h5 className="summary__title">
            <box-icon name="coin-stack" type="solid"></box-icon>
            <span>Expended</span>
          </h5>
          <h5 className="summary__val summary__val--danger text-danger">
            {total && convertNumberToCurrency(localCountryInfo.currency, expenseTotal)}
          </h5>
        </div>
      </div>

      <div className="task-table__wrapper">
        <table className="table task-table">
          <tbody>
            {demands &&
              demands.map((item) => {
                let demand = item.data;

                return (
                  <tr
                    className="task-table__row"
                    key={item.id}
                    onClick={() => handleEditDemand(item.id)}
                  >
                    <td className="text-start">{demand.title}</td>
                    <td className="text-end fw-bolder">
                      {convertNumberToCurrency(
                        localCountryInfo.currency,
                        demand.amount
                      )}
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className="container task__add-btn">
        <EclipseButton customClass="btn--task-add" callback={handleAddDemand}>
          <i className="fas fa-plus"></i>
        </EclipseButton>
      </div>
    </>
  );
}
