import React, { useEffect, useRef } from 'react'
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { DatabaseCollections, useFirestore } from '../../../Database/useFirestore';
import { useHomeController } from '../../HomeContext';

export default function MonthlyTasks() {
  // #region State
  const history = useHistory();
  const locations = useLocation();

  // Get loading animantion, alert message, current location information from home-Controller.
  const {
    handleErrorShow,
    handleErrorClose,
    setErrorModalContent,
    handleConfirmShow,
    handleConfirmClose,
    setConfirmModalContent,
    localCountryInfo,
    setLoading,
  } = useHomeController();

  // Database method
  const { getDocumentsByPagination, deleteDocument } = useFirestore(
    DatabaseCollections.Tasks
  );
  // getting data from Flag, use for saving firebase-read operation
  const loadDataFlag = useRef(false);

    // Redirect to current date tab if URL don't have date param
    useEffect(() => {
      const search = locations.search;

      const month = new URLSearchParams(search).get("month");
      const year = new URLSearchParams(search).get("year");

      if(!month || !year){
        let currMonth = new Date().getMonth() + 1;
        let currYear = new Date().getFullYear();

        history.push(`/monthly?month=${currMonth}&year=${currYear}`);
        return
      }
      
      console.log(month, year)
    }, [locations]);

  return (
    <div>TasksByMonths</div>
  )
}
