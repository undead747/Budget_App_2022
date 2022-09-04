import React from "react";
import { useHistory } from "react-router-dom";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";

export default function Debts() {
  const history = useHistory();

  const addDebts = () => history.push(`/debt/add`);

  return (
    <div className="debt">
      <EclipseButton customClass="btn--task-add" callback={addDebts}>
        <i className="fas fa-plus"></i>
      </EclipseButton>
    </div>
  );
}
