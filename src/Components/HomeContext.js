import React, { useContext, useEffect, useState } from 'react'
import {DatabaseCollections, useFirestoreRealtime } from '../Database/useFirestore';
import { getLocalCountryInfo } from '../Helpers/CountryHelper';
import { getCurrencyInfoByCode, getCurrencyRateByCode } from '../Helpers/CurrencyHelper';
import { sidebarData } from './Homepage/Sidebar/SidebarData';

const HomeControllerContext = React.createContext();

export function useHomeController(){
    return useContext(HomeControllerContext)
}  

export default function HomeProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectTab] = useState(sidebarData[0].id);
    const [localCountryInfo, setLocalCountryInfo] = useState();
    const accountCategories = useFirestoreRealtime(DatabaseCollections.AccountCategory);
    const incomeCategories = useFirestoreRealtime(DatabaseCollections.IncomeCategory);
    const expenseCategories = useFirestoreRealtime(DatabaseCollections.ExpenseCategory);

    const initLocalCountryInfo = async () => {
        let currentCountry = await getLocalCountryInfo();
        let currencyInfo = getCurrencyInfoByCode(currentCountry.countryCode);
        setLocalCountryInfo(currencyInfo);
    }

    useEffect(() => {
        initLocalCountryInfo();
    },[])

    const value = {
        loading,
        setLoading,
        selectedTab,
        setSelectTab,
        localCountryInfo,
        accountCategories,
        incomeCategories,
        expenseCategories
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
