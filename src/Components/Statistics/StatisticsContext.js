import React, { useContext, useState } from 'react'

const StatisticsContext = React.createContext();

export function useStatistics() {
    return useContext(StatisticsContext);
}

export default function StatisticsProvider({children}) {
    const {selectedTab, setSelectedTab} = useState();

    const value = {
        selectedTab, 
        setSelectedTab
    }

    return (
        <StatisticsContext.Provider value={value}>
            {children}
        </StatisticsContext.Provider>
    )
}
