import React, { useEffect, useState } from 'react'
import { convertNumberToCurrency } from '../../../Helpers/CurrencyHelper';
import { useHomeController } from '../../HomeContext';

export default function IncomeHeader({ budgets, debts, ...rest }) {
  const { localCountryInfo } = useHomeController();
  const [sum, setSum] = useState(parseFloat(0));

  // useEffect(() => {
  //   let sum = parseFloat(budgets) - parseFloat(debts);
  //   setSum(sum);
  // }, [budgets, debts]);

  const getSumDecorClass = () => {
    if (sum > 0) return "summary__val--success text-success";
    if (sum === 0) return "summary__val--warning text-warning";
    if (sum < 0) return "summary__val--danger text-danger";
  };

  return (
    <div className="budget-summary">
      <div className="summary__item">
        <h5 className="summary__title">
        <box-icon name='coin-stack' type='solid' ></box-icon>
          <span>Budgets</span>
        </h5>
        <h5 className="summary__val summary__val--success text-success ">
          {convertNumberToCurrency(localCountryInfo.currency, budgets)}
        </h5>
      </div>
      {/* <div className="summary__item">
        <h5 className="summary__title">
        <box-icon name='file'></box-icon>
          <span>Debts</span>
        </h5>
        <h5 className="summary__val summary__val--danger text-danger">
          {parseInt(debts) !== 0 && "- "}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, debts)}
        </h5>
      </div> */}
    </div>
  );
}
