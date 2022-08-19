import React, { useContext, useEffect, useState } from 'react'
import { useHistory } from 'react-router-dom';
import { taskModes } from '../../Constants/TaskConstaints';

export const StatisticsMode = {
    ByMonth: {
        id: 0,
        name: 'month'
    },
    Expenses: {
        id: 1,
        name: 'year',
    }
}

const StatisticsContext = React.createContext();

export function useStatistics() {
    return useContext(StatisticsContext);
}

export default function StatisticsProvider({ children }) {
    // #region State
    const [currDate, setCurrDate] = useState();
    const [taskMode, setTaskMode] = useState();
    const [statisticsMode, setStatisticsMode] = useState();
    const history = useHistory();
    // #endregion State

    useEffect(() => {
        const search = window.location.search;
        const params = new URLSearchParams(search);
        const date = new Date();

        const month = params.get('month');
        const year = params.get('year');
        const taskMode = params.get('taskMode');
        const statisticsMode = params.get('statisticsMode');

        if (month && year) setCurrDate(`${year}-${month}`);
        if (taskMode) setTaskMode(taskMode);
        if (statisticsMode) setStatisticsMode(statisticsMode);
    }, [window.location.href])

    const value = {
        currDate,
        setCurrDate,
        taskMode,
        setTaskMode,
        statisticsMode,
        setStatisticsMode
    }

    return (
        <StatisticsContext.Provider value={value}>
            {children}
        </StatisticsContext.Provider>
    )
}
