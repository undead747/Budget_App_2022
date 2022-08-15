import React, { useEffect, useState } from "react";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import "./income.css";

export default function Incomes() {
  const [incomes, setIncomes] = useState();
  const debts = parseFloat(0);

  const { getDocuments } = useFirestore(DatabaseCollections.Budgets);

  useEffect(() => {
    if (!incomes || incomes === 0) {
    }
  });

  return <></>;
}
