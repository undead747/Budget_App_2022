import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DebtModes } from "../../../Constants/TaskConstaints";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import { convertNumberToCurrency } from "../../../Helpers/CurrencyHelper";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";
import { useHomeController } from "../../HomeContext";
import './debt.css'

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
    setLoading
  } = useHomeController();

  useEffect(() => {
    loadDebts();
  }, []);

  const loadDebts = async () => {
    try {
      setLoading(true);
      let debts = await getDocuments();
      setLoading(false);

      console.log(debts)
      if (debts) {
        setDebts(debts);
      }
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    }
  }

  const addDebts = () => history.push(`/debt/add`);

    /**
   * Handle edit task  event.
   * Redirect to edit form.
   * @param {string} taskId - delete task ID.
   */
     const handleEditDebt = (event, debtId) => {
      event.preventDefault();

      history.push(`/debt/${debtId}`);
    };

  return (
    <div className="debt">
      <div className="task-table">
        <table className="table task-table">
          <tbody>
            {
              debts && debts.map(debt => {
                const id = debt.id;
                const data = debt.data;

                let creditor = '';
                let debtor = '';

                if (data.type) {
                  switch (data.type.id) {
                    case DebtModes.OwedByMe.id:
                      creditor = data.name && data.name;
                      debtor = 'Me';
                      break;
                    case DebtModes.OwedToMe.id:
                      creditor = 'Me';
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
                    onClick={event => handleEditDebt(event, id)}
                  >
                    <td className="text-start">
                      <div className="d-flex flex-column align-items-start">
                      <span><i className="far fa-user"></i> <strong>Creditor:</strong> {creditor}</span>
                      <span><i className="far fa-user"></i> <strong>Debtor:</strong> {debtor}</span>
                      </div>
                    </td>
                    <td className="text-start">
                      <div className="d-flex flex-column align-items-center">
                        <span>{data.title && data.title}</span>
                        <span className="opacity-75">{data.note && data.note}</span>
                      </div>
                    </td>
                    <td>
                      <div className="d-flex flex-column align-items-center">
                        <span className="text-end fw-bolder">
                          {convertNumberToCurrency(data.currency, data.amount)}
                        </span>
                        <span className="summary__val summary__val--success text-success">
                        <i className="far fa-clock"></i> {data.deadline && data.deadline}
                        </span>
                      </div>
                    </td>
                  </tr>
                )
              })
            }
          </tbody>
        </table>
      </div>


      <EclipseButton customClass="btn--task-add" callback={addDebts}>
        <i className="fas fa-plus"></i>
      </EclipseButton>
    </div>
  );
}
