import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DebtModes } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberToCurrency } from "../../../Helpers/CurrencyHelper";
import { compareTwoDate } from "../../../Helpers/DateHelper";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";
import { useHomeController } from "../../HomeContext";
import "./debt.css";

export default function Debts() {
  const history = useHistory();

  const [debts, setDebts] = useState();

  const { getDocuments } = useFirestore(DatabaseCollections.Debts);

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    localCountryInfo,
    setLoading,
    spendLimitAlert, 
    debtAlert
  } = useHomeController();

  const decorAddButton = () => {
    let count = 0;

    if(spendLimitAlert) count += 1;
    if(debtAlert) count += 1;

    if(count === 0) return `container task__add-btn`;
    if(count === 1) return `container task__add-btn task__add-btn--1-alert`;
    if(count === 2) return `container task__add-btn task__add-btn--2-alert`;
  }

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setLoading(true);
      let debts = await getDocuments();
      setLoading(false);

      if (debts) {
        setDebts(debts);
      }
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  const decorDeadline = (deadline) => {
    const compareRslt = compareTwoDate(new Date(), deadline.toDate());

    if(compareRslt === 1) return "summary__val summary__val--success text-success";
    if(compareRslt === 0) return "summary__val summary__val--warning text-warning";
    if(compareRslt === -1) return "summary__val summary__val--danger text-danger";
  }

  const addDebts = () => history.push(`/debt/add`);
  

  /**
   * Handle edit task  event.
   * Redirect to edit form.
   * @param {string} taskId - delete task ID.
   */
  const handleEditDebt = (event, debtId) => {
    event.preventDefault();

    history.push(`/debt/edit/${debtId}`);
  };

  if (!debts || debts.length === 0)
    return (
      <>
        <div className="alert alert-warning" role="alert">
          don't have any data to display
        </div>

        <div className="container-md task__add-btn">
        <EclipseButton customClass="btn--task-add" callback={addDebts}>
          <i className="fas fa-plus"></i>
        </EclipseButton>
        </div>
      </>
    );

  return (
    <div className="debt">
      <div className="task-table__wrapper">
        <table className="table task-table">
          <tbody>
            {debts &&
              debts.map((debt) => {
                const id = debt.id;
                const data = debt.data;

                let creditor = "";
                let debtor = "";

                if (data.type) {
                  switch (data.type.id) {
                    case DebtModes.OwedByMe.id:
                      creditor = data.name && data.name;
                      debtor = "Me";
                      break;
                    case DebtModes.OwedToMe.id:
                      creditor = "Me";
                      debtor = data.name && data.name;
                      break;
                    default:
                      break;
                  }
                }

                return (
                  <tr
                    className="task-table__row"
                    key={id}
                    onClick={(event) => handleEditDebt(event, id)}
                  >
                    <td className="text-start text-nowrap">
                      <div className="d-flex flex-column align-items-start">
                        <span>
                          <i className="far fa-user"></i>{" "}
                          <strong>Creditor:</strong> {creditor}
                        </span>
                        <span>
                          <i className="far fa-user"></i>{" "}
                          <strong>Debtor:</strong> {debtor}
                        </span>
                      </div>
                    </td>
                    <td className="text-start text-nowrap">
                      <div className="d-flex flex-column align-items-center">
                        <span>{data.title && data.title}</span>
                        <span className="opacity-75">
                          {data.note && data.note}
                        </span>
                      </div>
                    </td>
                    <td className="text-nowrap">
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-end fw-bolder">
                          {convertNumberToCurrency(data.currency, data.amount)}
                        </span>
                        <span className={decorDeadline(data.formatedDeadline)}>
                          <i className="far fa-clock"></i>{" "}
                          {data.deadline && data.deadline}
                        </span>
                      </div>
                    </td>
                  </tr>
                );
              })}
          </tbody>
        </table>
      </div>

      <div className={decorAddButton()}>
        <EclipseButton customClass="btn--task-add" callback={addDebts}>
          <i className="fas fa-plus"></i>
        </EclipseButton>
        </div>
    </div>
  );
}
