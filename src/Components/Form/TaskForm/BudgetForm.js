import { Timestamp } from "firebase/firestore";
import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { useHistory, useParams } from "react-router-dom";
import { taskModes } from "../../../Constants/TaskConstaints";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import {
  convertNumberWithCommas,
  getCurrencyRateByCode,
  getSymbolByCurrency,
} from "../../../Helpers/CurrencyHelper";
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { CustomButton } from "../../CommonComponents/Button/Button";
import GobackButton from "../../CommonComponents/Button/GobackButton";
import { useHomeController } from "../../HomeContext";
import { useAccountCategoryModal, useTaskCategoryModal } from "./CategoryModal";
import { useCurrencyModal } from "./CurrencyModal";
import "./task-form.css";

/**
 * Add-Edit currency form.
 * Return Form component.
 */
export default function BudgetForm(props) {
  // #region State

  const { mode, id: formId } = useParams();
  const history = useHistory();

  // Store Form-Task value.
  const [selectedBudget, setSelectedBudget] = useState({
    amount: parseFloat(0),
    currency: null,
  });

  // Define Form Refs
  const titleRef = useRef(),
    amountRef = useRef();

  // Store selected task id if Form is in edit mode.
  const selectedBudgetId = useRef();

  // Get loading animantion, alert message from home-Controller.
  const {
    setLoading,
    localCountryInfo,
    handleErrorShow,
    setErrorModalContent,
  } = useHomeController();

  // Database methods.
  const { addDocument, updateDocument, getDocumentById } = useFirestore(
    DatabaseCollections.Budgets
  );

  const {
    show: CurrencyModalShow,
    handleShow: handleCurrencyShow,
    CurrencyModal,
  } = useCurrencyModal();

  // #endregion State

  /**
   * Handle submit event.
   * @param {object} event - triggered submit button.
   */
  const handleSubmit = async (event) => {
    try {
      event.preventDefault();

      let Budget = {
        ...selectedBudget,
        title: titleRef.current.value,
      };

      setLoading(true);

      if (mode === "add") await addDocument(Budget);
      if (mode === "edit") await updateDocument(Budget, selectedBudgetId.current);

      setLoading(false);

      history.push(`/budgets/spendinglimit`);
    } catch (error) {
      console.log(error);
      setErrorModalContent(error.message);
      handleErrorShow();
    }
  };

  // Handle Open Modals event.
  const handleDisplayCurrencyModal = () => {
    handleCurrencyShow();
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
      setSelectedBudget({ ...selectedBudget, amount: 0 });
      return;
    }

    currentValue = currentValue.replaceAll(",", "");

    // If new input character is not number => remove it.
    if (isNaN(Number(currentValue))) {
      amountRef.current.value = 0;
      setSelectedBudget({ ...selectedBudget, amount: 0 });
      return;
    }

    if (currentValue.includes(".", currentValue.length - 1)) return;

    let formatedCurrency = convertNumberWithCommas(Number(currentValue));

    amountRef.current.value = formatedCurrency;
    setSelectedBudget({
      ...selectedBudget,
      amount: parseFloat(currentValue),
    });
  };

  /**
   * Init date-picker value when task mode is add,
   * Otherwise date-picker value will be inited by below useEffect.
   */
  useEffect(() => {
    if (mode === "add") {
      if (localCountryInfo && !selectedBudget.currency) {
        setSelectedBudget({
          ...selectedBudget,
          currency: localCountryInfo.currency,
        });
      }
    }

    if (mode === "edit") {
      initBudgetById();
    }
  }, [localCountryInfo]);

  const initBudgetById = async () => {
    if (!formId) return;

    try {
      setLoading(true);

      const doc = await getDocumentById(formId);
      const Budget = doc.data;

      // Init State values.
      setSelectedBudget(Budget);
      selectedBudgetId.current = doc.id;

      // Init Form Refs values.
      amountRef.current.value = convertNumberWithCommas(Number(Budget.amount));
      titleRef.current.value = Budget.title;

    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

  // #endregion Function

  return (
    <div className="task-form">
      <div className="container">
        <div className="task-form__header">
          <GobackButton
            backgroundColor={"transparent"}
            callback={history.goBack}
          >
            Go back
          </GobackButton>
          <h5 className="task-form__title">{`${mode} Budget`}</h5>
        </div>

        <div className="task-form__form-content">
          <Form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="amount" className="form-label">
                Amount
              </label>
              <div className="task-form__amount-input">
                <span
                  className="task-form__amount-input-icon"
                  onClick={handleDisplayCurrencyModal}
                >
                  {selectedBudget.currency &&
                    getSymbolByCurrency(selectedBudget.currency)}
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

            <div className="d-grid gap-2">
              <CustomButton type="submit">{mode}</CustomButton>
            </div>
          </Form>
        </div>

        {CurrencyModalShow && (
          <CurrencyModal
            amountRef={amountRef}
            setSelectedTask={setSelectedBudget}
            selectedTask={selectedBudget}
          />
        )}
      </div>
    </div>
  );
}
