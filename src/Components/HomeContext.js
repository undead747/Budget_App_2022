import React, { useContext, useState } from 'react'
import { useEffect } from 'react';
import { DatabaseCollections, useFirestore } from '../Database/useFirestore';
import { sidebarData } from './Homepage/Sidebar/SidebarData';

const HomeControllerContext = React.createContext();

export function useHomeController(){
    return useContext(HomeControllerContext)
}  

export default function HomeProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [accountCategory, setAccountCategory] = useState();
    const [expenseCategory, setExpenseCategory] = useState();
    const [incomeCategory, setIncomeCategory] = useState();
    const [selectedTab, setSelectTab] = useState(sidebarData[0].id);

    const accountCateInst = useFirestore(DatabaseCollections.AccountCategory);
    const expenseCateInst = useFirestore(DatabaseCollections.ExpenseCategory);
    const incomeCateInst = useFirestore(DatabaseCollections.IncomeCategory);

    const value = {
        loading,
        setLoading,
        selectedTab,
        setSelectTab
    }

    useEffect(() => {
        accountCateInst.getDocuments().then((res) => {
          setAccountCategory(res);
        });
    }, [])

    return (
    <HomeControllerContext.Provider value={value}>
         {loading && (
        <div className="page-loading">
          <div className="page-loading__content">
            <div className="spinner-border" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
            <h5 className="page-loading__title">Loading...</h5>
          </div>
        </div>
      )}
        {children}
    </HomeControllerContext.Provider>
  )
}
