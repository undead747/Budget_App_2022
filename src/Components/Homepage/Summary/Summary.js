import React, { useEffect, useState } from "react";
import { convertNumberToCurrency } from "../../../Helpers/CurrencyHelper";
import { useHomeController } from "../../HomeContext";

export default function Summary({ expenseTotal, incomeTotal, ...rest }) {
  const { localCountryInfo } = useHomeController();

  const [sum, setSum] = useState(Number(0).toFixed(2));

  useEffect(() => {
    let sum = parseFloat(incomeTotal) - parseFloat(expenseTotal);
    setSum(sum);
  }, [expenseTotal, incomeTotal]);

  const getSumDecorClass = () => {
    if (sum > 0) return "summary__val--success text-success";
    if (sum === 0) return "summary__val--warning text-warning";
    if (sum < 0) return "summary__val--danger text-danger";
  };

  const getSumDecorSymbol = () => {
    if (sum > 0) return "+ ";
  };

  return (
    <div className="summary">
      <div className="summary__item">
        <h5 className="summary__title">
          <i className="fas fa-long-arrow-alt-up summary__icon"></i>
          <span>Income</span>
        </h5>
        <h5 className="summary__val summary__val--success text-success">
          {parseInt(incomeTotal) !== 0 && "+ "}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, incomeTotal)}
        </h5>
      </div>
      <div className="summary__item">
        <h5 className="summary__title">
          <i className="fas fa-long-arrow-alt-down summary__icon"></i>
          <span>Expense</span>
        </h5>
        <h5 className="summary__val summary__val--danger text-danger">
          {parseInt(expenseTotal) !== 0 && "- "}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, expenseTotal)}
        </h5>
      </div>
      <div className="summary__item">
        <h5 className="summary__title">
          <span>Sum</span>
        </h5>
        <h5 className={`summary__val ${getSumDecorClass()}`}>
          {getSumDecorSymbol()}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, sum)}
        </h5>
      </div>
    </div>
  );
}
