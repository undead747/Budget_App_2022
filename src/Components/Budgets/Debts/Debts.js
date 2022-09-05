import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";
import { useHomeController } from "../../HomeContext";

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
      if(debts){
        setDebts(debts);
      }
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } 
  }

  const addDebts = () => history.push(`/debt/add`);

  return (
    <div className="debt">
        <div className="task-table">
      <table className="table">
        <tbody>
          {debts && debts.map((debt) => {
            const id = debt.id;
            const data = debt.data;

            return (
              <tr
                className="task-table__row"
                key={id}
              >
                <td className="text-start task-table__row-title">
                  <span className="opacity-75">
                    {data.title && data.title}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      </div>


      <EclipseButton customClass="btn--task-add" callback={addDebts}>
        <i className="fas fa-plus"></i>
      </EclipseButton>
    </div>
  );
}
