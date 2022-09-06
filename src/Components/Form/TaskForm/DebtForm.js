import { Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { DebtModes } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { convertNumberWithCommas, getSymbolByCurrency } from "../../../Helpers/CurrencyHelper";
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { CustomButton } from "../../CommonComponents/Button/Button";
import GobackButton from "../../CommonComponents/Button/GobackButton";
import { useHomeController } from "../../HomeContext";

export default function DebtForm() {
  // #region State
  const history = useHistory();
  const { mode, id: formId } = useParams();

  const [selectedDebtMode, setSelectedDebtMode] = useState(DebtModes.OwedByMe);

  const [selectedDebt, setSelectedDebt] = useState({
    amount: parseFloat(0),
    currency: null,
  });

  const
    incurredDateRef = useRef(),
    deadlineRef = useRef(),
    nameRef = useRef(),
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

      let incurredFirebaseDate = Timestamp.fromDate(new Date(incurredDateRef.current.value));
      let deadlineFirebaseDate = Timestamp.fromDate(new Date(deadlineRef.current.value));

      let debt = {
        ...selectedDebt,
        name: nameRef.current.value,
        deadline: deadlineRef.current.value,
        formatedDeadline: deadlineFirebaseDate,
        incurredDate: incurredDateRef.current.value,
        formatedIncurredDate: incurredFirebaseDate,
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
      incurredDateRef.current.value = getFormatDateForDatePicker(new Date());

      if (localCountryInfo && !selectedDebt.currency) {
        setSelectedDebt({ ...selectedDebt, currency: localCountryInfo.currency });
      }
    }

    if (mode === "edit") {
    }
  }, [localCountryInfo]);

  const initTaskById = async () => {
    if (!formId) return;

    try {
      setLoading(true);

      const doc = await getDocumentById(formId);
      const debt = doc.data;

      // Init State values.
      setSelectedDebt(debt);
      selectedDebtId.current = doc.id;

      // Init Form Refs values.
      deadlineRef.current.value = debt.deadline;
      amountRef.current.value = convertNumberWithCommas(Number(debt.amount));

      titleRef.current.value = debt.title;
      noteRef.current.value = debt.note;

      // Init Task Mode.
      setSelectedDebtMode(debt.type);
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form">
      <div className="task-form__header">
        <GobackButton backgroundColor={"transparent"} callback={history.goBack}>
          Go back
        </GobackButton>
        <h5 className="task-form__title">{selectedDebtMode.name}</h5>
      </div>

      <ButtonGroup className="task-form__button-group">
        {Object.keys(DebtModes).map((key) => {
          if (DebtModes[key].id === selectedDebtMode.id)
            return <CustomButton key={key}>{DebtModes[key].name}</CustomButton>;

          return (
            <BorderButton
              border={{ size: 2 }}
              callback={() => handleSelectMode(DebtModes[key])}
              key={key}
            >
              {DebtModes[key].name}
            </BorderButton>
          );
        })}
      </ButtonGroup>

      <div className="task-form__form-content">
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="task-date" className="form-label">
              Incurred Date
            </label>
            <input
              className="form-control task-form__date-input"
              type="date"
              ref={incurredDateRef}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="task-date" className="form-label">
              Deadline
            </label>
            <input
              className="form-control task-form__date-input"
              type="date"
              ref={deadlineRef}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Name
            </label>
            <input className="form-control" type="text" ref={nameRef} required />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <div className="task-form__amount-input">
              <span
                className="task-form__amount-input-icon"
              >
                {selectedDebt.currency &&
                  getSymbolByCurrency(selectedDebt.currency)}
              </span>
              <input
                className="form-control"
                type="text"
                ref={amountRef}
                onChange={handleCurrencyInputEvent}
                defaultValue={0}
                required
              ></input>
            </div>
          </div>

          <div className="mb-3">
            <label htmlFor="title" className="form-label">
              Title
            </label>
            <input className="form-control" type="text" ref={titleRef} />
          </div>

          <div className="mb-3">
            <label htmlFor="note" className="form-label">
              Note
            </label>
            <textarea
              className="form-control"
              ref={noteRef}
              rows="3"
            ></textarea>
          </div>

          <div className="d-grid gap-2">
            <CustomButton type="submit" customClass={"text-capitalize"}>{mode}</CustomButton>
            {
              mode === "edit" && <>
                <CustomButton type="submit" customClass={"btn--complete mt-3"}>Complete</CustomButton>
                <CustomButton type="submit" customClass={"btn--delete"}>Delete</CustomButton>
              </>
            }
          </div>
        </Form>
      </div>
    </div>
  );
}
