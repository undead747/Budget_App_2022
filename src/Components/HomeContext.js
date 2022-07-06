import React, { useContext, useState } from 'react'
import {DatabaseCollections, useFirestoreRealtime } from '../Database/useFirestore';
import { sidebarData } from './Homepage/Sidebar/SidebarData';

const HomeControllerContext = React.createContext();

export function useHomeController(){
    return useContext(HomeControllerContext)
}  

export default function HomeProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectTab] = useState(sidebarData[0].id);
    const accountCategory = useFirestoreRealtime(DatabaseCollections.AccountCategory);
    const incomeCategory = useFirestoreRealtime(DatabaseCollections.IncomeCategory);
    const expenseCategory = useFirestoreRealtime(DatabaseCollections.ExpenseCategory);

    const value = {
        loading,
        setLoading,
        selectedTab,
        setSelectTab,
        accountCategory,
        incomeCategory,
        expenseCategory
    }

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
