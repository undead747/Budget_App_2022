import React from "react";
import EclipseButton from "../../CommonComponents/Button/EclipseButton";

export default function Debts() {
  return (
    <div className="debt">
      <EclipseButton customClass="btn--task-add">
        <i className="fas fa-plus"></i>
      </EclipseButton>
    </div>
  );
}
