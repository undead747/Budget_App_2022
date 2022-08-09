import React, { useContext, useState } from 'react'

const BudgetsContext = React.createContext();

// Return current context values.
export function useBudgets() {
    return useContext(BudgetsContext);
}

export default function BudgetProvider({ children }) {
    // #region State
    const [selectedTab, setSelectTab] = useState();    
    // #endregion State

    const value = {
        selectedTab,
        setSelectTab
    };

    return (
        <BudgetsContext.Provider value={value}>
            {children}
        </BudgetsContext.Provider>
    )
}
