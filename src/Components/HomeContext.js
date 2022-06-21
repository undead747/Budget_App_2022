import React, { useContext, useState } from 'react'
import { sidebarData } from './Homepage/Sidebar/SidebarData';

const HomeControllerContext = React.createContext();

export function useHomeController(){
    return useContext(HomeControllerContext)
}  

export default function HomeProvider({children}) {
    const [loading, setLoading] = useState(false);
    const [selectedTab, setSelectTab] = useState(sidebarData[0].id);
    const [selectedDate, setSelectDate] = useState();

    const value = {
        loading,
        setLoading,
        selectedTab,
        setSelectTab,
        selectedDate,
        setSelectDate
    }

    return (
    <HomeControllerContext.Provider value={value}>
        {children}
    </HomeControllerContext.Provider>
  )
}
