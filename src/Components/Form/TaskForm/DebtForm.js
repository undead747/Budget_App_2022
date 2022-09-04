import { Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { DebtModes } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberWithCommas } from "../../../Helpers/CurrencyHelper";
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
import { CustomButton } from "../../CommonComponents/Button/Button";
import GobackButton from "../../CommonComponents/Button/GobackButton";
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

  // Store selected task id if Form is in edit mode.
  const selectedDebtId = useRef();

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
    const handleSelectMode = (mode) => setSelectedDebtMode(mode);

      /**
   * Handle submit event.
   * @param {object} event - triggered submit button.
   */
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      let firebaseDate = Timestamp.fromDate(new Date(deadlineRef.current.value));

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

      if (mode === "add") await addDocument(debt);
      if (mode === "edit") await updateDocument(debt, selectedDebtId.current);

      setLoading(false);

      history.push(`/budgets/debts`);
    } catch (error) {
      console.log(error)
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    }
  };

  /**
   * Handle auto-format input currency.
   * Change selectedTask value (amount), amountRef.
   * @param {object} event - triggered search box element.
   */
   const handleCurrencyInputEvent = (event) => {
    let currentValue = amountRef.current.value;

    // If current amount input is empty string, convert it to 0.
    if (!currentValue) {
      amountRef.current.value = 0;
      setSelectedDebt({ ...selectedDebt, amount: 0 });
      return;
    }

    currentValue = currentValue.replaceAll(",", "");

    // If new input character is not number => remove it.
    if (isNaN(Number(currentValue))) {
      amountRef.current.value = 0;
      setSelectedDebt({ ...selectedDebt, amount: 0 });
      return;
    }

    if (currentValue.includes(".", currentValue.length - 1)) return;

    let formatedCurrency = convertNumberWithCommas(Number(currentValue));

    amountRef.current.value = formatedCurrency;
    setSelectedDebt({
      ...selectedDebt,
      amount: parseFloat(currentValue),
    });
  };

    /**
   * Init date-picker value when task mode is add,
   * Otherwise date-picker value will be inited by below useEffect.
   */
     useEffect(() => {
        if (mode === "add") {
          deadlineRef.current.value = getFormatDateForDatePicker(new Date());
          
          if (localCountryInfo && !selectedDebt.currency) {
            setSelectedDebt({ ...selectedDebt, currency: localCountryInfo.currency });
          }
        }
    
        if (mode === "edit") {
        }
      }, [localCountryInfo]);

  return (
    <div className="task-form">
    <div className="task-form__header">
      <GobackButton backgroundColor={"transparent"} callback={history.goBack}>
        Go back
      </GobackButton>
      <h5 className="task-form__title">{selectedDebtMode.name}</h5>
    </div>


    <div className="task-form__form-content">
      <Form onSubmit={handleSubmit}>
        <div className="mb-3">
          <label htmlFor="task-date" className="form-label">
            Date
          </label>
          <input
            className="form-control task-form__date-input"
            type="date"
            ref={deadlineRef}
            required
          />
        </div>

        <div className="d-grid gap-2">
          <CustomButton type="submit">Submit</CustomButton>
        </div>
      </Form>
    </div>
  </div>
  );
}
