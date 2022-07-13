import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { taskModes } from "../../../Constants/TaskConstaints";
import { convertNumberToCurrency, currencyParams, searchCurrencyByParam } from "../../../Helpers/CurrencyHelper";
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { CustomButton } from "../../CommonComponents/Button/Button";
import GobackButton from "../../CommonComponents/Button/GobackButton";
import useModal from "../../CommonComponents/Modal/modal";
import { useHomeController } from "../../HomeContext";
import { AccountCategoryModal, TaskCategoryModal } from "./CategoryModal";
import setCurrencyModal from "./CurrencyModal";
import "./task-form.css";

function TaskForm(props) {
  // Singleton modal
  const {
    handleClose,
    handleShow,
    setIModalStates,
    ModalComponent
  } = useModal();

  const [selectedTaskMode, setSelectedTaskMode] = useState(taskModes.Income);
  const [selectedCurrency, setSelectedCurrency] = useState();

  // State data from home controller
  const {
    localCountryInfo,
    accountCategories,
    incomeCategories,
    expenseCategories,
  } = useHomeController();

  // Define form refs
  const titleRef = useRef(),
    dateRef = useRef(),
    accountCategoryRef = useRef(),
    taskCategoryRef = useRef(),
    amountRef = useRef(),
    noteRef = useRef();

  const handleSelectMode = (mode) => setSelectedTaskMode(mode);

  const handleSubmit = (event) => { };

  // Handle Display Modals
  const handleDisplayAccountCategoryModal = () => {
    accountCategoryRef.current.blur();
    AccountCategoryModal({ accountCategories, handleClose, setIModalStates, accountCategoryRef });
    handleShow();
  };

  const handleDisplayTaskCategoryModal = () => {
    taskCategoryRef.current.blur();

    TaskCategoryModal({ selectedTaskMode, incomeCategories, expenseCategories, handleClose, setIModalStates, taskCategoryRef })
    handleShow();
  };

  const handleDisplayCurrencyModal = () => {
    setCurrencyModal({ setIModalStates });
  }

  // Format money real-time when user input money
  const handleCurrencyInputEvent = (event) => {
    let currentValue = amountRef.current.value;

    if (localCountryInfo.iso && currentValue) {
      let convertedCurrency = convertNumberToCurrency(
        localCountryInfo.iso,
        currentValue
      );
      if (isNaN(parseFloat(convertedCurrency))) {
        amountRef.current.value = 0;
        return;
      }

      amountRef.current.value = convertedCurrency;
    }
  };


  useEffect(() => {
    dateRef.current.value = getFormatDateForDatePicker();
  });

  // Set Default currency base by local informations
  useEffect(() => {
    if (localCountryInfo && !selectedCurrency) {
      setSelectedCurrency(localCountryInfo.currency);
    }
  }, [localCountryInfo])

  return (
    <div className="task-form">
      <div className="task-form__header">
        <GobackButton backgroundColor={"transparent"}>Go back</GobackButton>
        <h5 className="task-form__title">{selectedTaskMode.name}</h5>
      </div>

      <ButtonGroup className="task-form__button-group">
        {Object.keys(taskModes).map((key) => {
          if (taskModes[key].id === selectedTaskMode.id)
            return <CustomButton key={key}>{taskModes[key].name}</CustomButton>;

          return (
            <BorderButton
              border={{ size: 2 }}
              backgroundColor={"transparent"}
              callback={() => handleSelectMode(taskModes[key])}
              key={key}
            >
              {taskModes[key].name}
            </BorderButton>
          );
        })}
      </ButtonGroup>

      <div className="task-form__form-content">
        <Form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="task-date" className="form-label">
              Date
            </label>
            <input
              className="form-control task-form__date-input"
              type="date"
              ref={dateRef}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="account-category" className="form-label">
              Account
            </label>
            <input
              className="form-control"
              onClick={handleDisplayAccountCategoryModal}
              type="text"
              ref={accountCategoryRef}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="task-category" className="form-label">
              Category
            </label>
            <input
              className="form-control"
              onClick={handleDisplayTaskCategoryModal}
              type="text"
              ref={taskCategoryRef}
              required
            />
          </div>

          <div className="mb-3">
            <label htmlFor="amount" className="form-label">
              Amount
            </label>
            <div className="task-form__amount-input">
              <span className="task-form__amount-input-icon" onChange={handleDisplayCurrencyModal}>
                {localCountryInfo && localCountryInfo.symbol}
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
            <CustomButton type="submit">Submit</CustomButton>
          </div>
        </Form>
      </div>

      <ModalComponent />
    </div>
  );
}

export default TaskForm;
