import React, { useContext, useState } from 'react'

const HomeControllerContext = React.createContext();

export function useHomeController(){
    return useContext(HomeControllerContext)
}  

export default function HomeProvider({children}) {
    const [loading, setLoading] = useState(false);

    const value = {
        loading,
        setLoading
    }

    return (
    <HomeControllerContext.Provider value={value}>
        {children}
    </HomeControllerContext.Provider>
  )
}
