import React from 'react'
import { useHomeController } from '../../HomeContext';

export default function IncomeHeader({ budgets, debts, ...rest }) {
  const { localCountryInfo } = useHomeController();
  const [sum, setSum] = useState(parseFloat(0));

  useEffect(() => {
    let sum = parseFloat(budgets) - parseFloat(debts);
    setSum(sum);
  }, [budgets, debts]);

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
          <span>Budgets</span>
        </h5>
        <h5 className="summary__val summary__val--success text-success">
          {parseInt(budgets) !== 0 && "+ "}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, budgets)}
        </h5>
      </div>
      <div className="summary__item">
        <h5 className="summary__title">
          <i className="fas fa-long-arrow-alt-down summary__icon"></i>
          <span>Debts</span>
        </h5>
        <h5 className="summary__val summary__val--danger text-danger">
          {parseInt(debts) !== 0 && "- "}{" "}
          {convertNumberToCurrency(localCountryInfo.currency, debts)}
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
