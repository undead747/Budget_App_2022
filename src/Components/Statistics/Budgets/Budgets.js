import React, { useEffect, useRef, useState } from 'react'
import { DatabaseCollections, useFirestore } from '../../../Database/useFirestore';
import { useHomeController } from '../../HomeContext';
import { BudgetsChart } from '../Chart/Chart';

export default function Budgets() {
  const loadDataFlag = useRef(false);
  const [budgets, setBudgets] = useState();

  // Get loading animantion, alert message, current location information from home-Controller.
  const { setLoading } = useHomeController();

  // Database method
  const { getDocumentsByPagination } = useFirestore(DatabaseCollections.Budgets);

  useEffect(() => {
    loadBudgets();
  })

  const loadBudgets = async () => {
    try {
      if (loadDataFlag.current === false) {
        loadDataFlag.current = true;

        setLoading(true);
        let budgets = await getDocumentsByPagination();
        setLoading(false);
        setBudgets(budgets);
      }
    } catch (errors) {
      
    }
  }

  return (
    <BudgetsChart budgets={budgets} />
  )
}
