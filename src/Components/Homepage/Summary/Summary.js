import React, { useEffect, useState } from "react";
import './summary.css';

export default function Summary({ income = 0, expense = 0 }) {
  const [sum, setSum] = useState(0);

  const getSumDecorClass = () => {
    if(sum > 0) return 'summary__val--success text-success';
    if(sum === 0) return 'summary__val--warning text-warning';
    if(sum < 0) return 'summary__val--success text-success';
  } 

  useEffect(() => {
     setSum(income - expense);
  },[income, expense])
    
  return (
    <div className="summary">
      <div className="summary__item">
        <h5 className="summary__title">
          <i className="fas fa-long-arrow-alt-up summary__icon"></i>
          <span>Income</span>
        </h5>
        <h5 className="summary__val summary__val--success text-success">{income.toFixed(2)}</h5>
      </div>
      <div className="summary__item">
        <h5 className="summary__title">
          <i className="fas fa-long-arrow-alt-down summary__icon"></i>
          <span>Expense</span>
        </h5>
        <h5 className="summary__val summary__val--danger text-danger">{expense.toFixed(2)}</h5>
      </div>
      <div className="summary__item">
        <h5 className="summary__title">
          <span>Sum</span>
        </h5>
        <h5 className={`summary__val ${getSumDecorClass()}`}>{sum.toFixed(2)}</h5>
      </div>
    </div>
  );
}
