import React, { useEffect, useRef, useState } from "react";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import { convertNumberToCurrency } from "../../../Helpers/CurrencyHelper";
import { useHomeController } from "../../HomeContext";
import "./income.css";
import IncomeHeader from "./IncomeHeader";

export default function Incomes() {
  const [incomes, setIncomes] = useState();
  const [budgets, setBudgets] = useState();

  const { getDocuments } = useFirestore(DatabaseCollections.Budgets);

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    localCountryInfo,
    setLoading
  } = useHomeController();

  useEffect(() => {
    loadIncomes();
  }, []);

  const loadIncomes = async () => {
    try {
      setLoading(true);
      let incomes = await getDocuments();
      setLoading(false);

      if(incomes){
        setIncomes(incomes);
        
        let total = parseFloat(0);
        incomes.forEach(cate => {
           total += parseFloat(cate.data.amount);
        })

        setBudgets(total);
      }
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } 
  }

  return <>
      <IncomeHeader budgets={budgets} debts={0} />

      <table className="table task-table">
        <tbody>
            {
              incomes && incomes.map(cate => {
                let budget = cate.data;

                return (
                  <tr
                  className="task-table__row"
                  key={cate.id}
                >
                  <td className="text-start">
                    {budget.name}
                  </td>
                  <td className="text-end fw-bolder">
                    {convertNumberToCurrency(localCountryInfo.currency, budget.amount)}
                  </td>
                </tr>
                )
              })
            }          
        </tbody>
      </table>
  </>;
}
