import React, { useContext, useEffect, useState } from "react";
import {
  DatabaseCollections,
  useFirestore,
  useFirestoreRealtime,
} from "../Database/useFirestore";
import { getLocalCountryInfo } from "../Helpers/CountryHelper";
import {
  getAllCurrenciesInfo,
  getCurrencyInfoByCountryCode,
  getCurrencyRateByCode,
} from "../Helpers/CurrencyHelper";
import {
  useConfirmMailSyncModal,
  useConfirmModal,
  useErrorModal,
  useSuccessModal,
} from "./CommonComponents/Modal/modal";

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
  const [debtAlert, setDebtAlert] = useState(false);
  const [spendLimitAlert, setSpendLimitAlert] = useState(false);
  const [gmailUser, setGmailUser] = useState();

  const [demandTotal, setDemandTotal] = useState();

  const accountCategories = useFirestoreRealtime(
    DatabaseCollections.AccountCategory
  );
  const incomeCategories = useFirestoreRealtime(
    DatabaseCollections.IncomeCategory
  );
  const expenseCategories = useFirestoreRealtime(
    DatabaseCollections.ExpenseCategory
  );

  const { getDocuments: getDemands } = useFirestore(
    DatabaseCollections.Demands
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

  const {
    show: confirmMailSyncModalShow,
    handleShow: handleConfirmMailSyncModalShow,
    handleClose: handleConfirmMailSyncModalClose,
    ConfirmMailSyncModal,
    setConfirmMailSyncModalContent,
  } = useConfirmMailSyncModal();
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
    gmailUser,
    setGmailUser,
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
    handleConfirmMailSyncModalShow,
    handleConfirmMailSyncModalClose,
    setConfirmMailSyncModalContent,
    selectedTab,
    setSelectTab,
    selectedBottomTab,
    setSelectBottomTab,
    localCountryInfo,
    countriesCurrencyInfo,
    accountCategories,
    incomeCategories,
    expenseCategories,
    spendLimitAlert,
    setSpendLimitAlert,
    debtAlert,
    setDebtAlert
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
      {confirmMailSyncModalShow && <ConfirmMailSyncModal />}
    </HomeControllerContext.Provider>
  );
}
