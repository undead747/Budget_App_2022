import React, { useContext, useEffect, useState } from "react";
import {
  DatabaseCollections,
  useFirestoreRealtime,
} from "../Database/useFirestore";
import { getLocalCountryInfo } from "../Helpers/CountryHelper";
import {
  getAllCurrenciesInfo,
  getCurrencyInfoByCountryCode,
} from "../Helpers/CurrencyHelper";
import {
  useConfirmModal,
  useErrorModal,
  useSuccessModal,
} from "./CommonComponents/Modal/modal";
import { sidebarData } from "./Homepage/Sidebar/SidebarData";

const HomeControllerContext = React.createContext();

export function useHomeController() {
  return useContext(HomeControllerContext);
}

export default function HomeProvider({ children }) {
  // #region State
  const [loading, setLoading] = useState(false);
  const [selectedTab, setSelectTab] = useState();
  const [selectedBottomTab, setSelectBottomTab] = useState();
  const [localCountryInfo, setLocalCountryInfo] = useState();
  const [countriesCurrencyInfo, setCountriesCurrencyInfo] = useState();
  const accountCategories = useFirestoreRealtime(
    DatabaseCollections.AccountCategory
  );
  const incomeCategories = useFirestoreRealtime(
    DatabaseCollections.IncomeCategory
  );
  const expenseCategories = useFirestoreRealtime(
    DatabaseCollections.ExpenseCategory
  );

  const {
    show: successShow,
    handleShow: handleSuccessShow,
    handleClose: handleSuccessClose,
    SuccessModal,
    setSucessModalContent,
  } = useSuccessModal();
  const {
    show: errorShow,
    handleShow: handleErrorShow,
    handleClose: handleErrorClose,
    ErrorModal,
    setErrorModalContent,
  } = useErrorModal();
  const {
    show: confirmShow,
    handleShow: handleConfirmShow,
    handleClose: handleConfirmClose,
    ConfirmModal,
    setConfirmModalContent,
  } = useConfirmModal();
  // #endregion State

  // #region Function
  const initLocalCountryInfo = async () => {
    let currentCountry = await getLocalCountryInfo();
    let currencyInfo = getCurrencyInfoByCountryCode(currentCountry.countryCode);
    setLocalCountryInfo(currencyInfo);
  };

  const initCountriesCurrency = () => {
    let currencyInfors = getAllCurrenciesInfo();
    setCountriesCurrencyInfo(currencyInfors);
  };

  useEffect(() => {
    initLocalCountryInfo();
    initCountriesCurrency();
  }, []);
  // #endregion Function

  const value = {
    loading,
    setLoading,
    handleSuccessShow,
    handleSuccessClose,
    setSucessModalContent,
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    handleConfirmShow,
    handleConfirmClose,
    setConfirmModalContent,
    selectedTab,
    setSelectTab,
    selectedBottomTab,
    setSelectBottomTab,
    localCountryInfo,
    countriesCurrencyInfo,
    accountCategories,
    incomeCategories,
    expenseCategories,
  };

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

      {successShow && <SuccessModal />}
      {errorShow && <ErrorModal />}
      {confirmShow && <ConfirmModal />}
    </HomeControllerContext.Provider>
  );
}
