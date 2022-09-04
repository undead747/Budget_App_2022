import React, { useState } from "react";
import { useHistory, useParams } from "react-router-dom";
import { DebtModes } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { useHomeController } from "../../HomeContext";

export default function DebtForm() {
  // #region State
  const history = useHistory();
  const { mode, id: formId } = useParams();

  const [selectedDebtMode, setSelectedDebtMode] = useState(DebtModes.MyDebt);

  const [selectedDebt, setSelectedDebt] = useState({
    amount: parseFloat(0),
    currency: null,
  });

  const deadlineRef = useRef(),
    creditorRef = useRef(),
    debtorRef = useRef(),
    amountRef = useRef(),
    titleRef = useRef(),
    noteRef = useRef();

  // Get loading animantion, alert message from home-Controller.
  const {
    setLoading,
    localCountryInfo,
    handleErrorShow,
    setErrorModalContent,
  } = useHomeController();

  // Database methods.
  const { addDocument, updateDocument, getDocumentById } = useFirestore(
    DatabaseCollections.Debts
  );
  // #endregion State

    // #region Function
    const handleSelectMode = (mode) => setSelectedTaskMode(mode);

      /**
   * Handle submit event.
   * @param {object} event - triggered submit button.
   */
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      let firebaseDate = Timestamp.fromDate(new Date(dateRef.current.value));

      let debt = {
        ...selectedDebt,
        creditor: creditorRef.current.value,
        debtor: debtorRef.current.value,
        deadline: deadlineRef.current.value,
        formatedDeadline: firebaseDate,
        note: noteRef.current.value,
        title: titleRef.current.value,
        type: selectedDebtMode,
      };

      setLoading(true);

      if (mode === "add") await addTask(task);
      if (mode === "edit") await updateTask(task, selectedTaskId.current);

      setLoading(false);

      history.push(`/daily/${dateRef.current.value}`);
    } catch (error) {
      console.log(error)
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    }
  };

  return <div>DebtForm</div>;
}
