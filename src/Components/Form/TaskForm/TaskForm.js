import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { convertNumberToCurrency } from "../../../Helpers/CurrencyHelper";
import { getFormatDateForDatePicker } from "../../../Helpers/DateHelper";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { CustomButton } from "../../CommonComponents/Button/Button";
import GobackButton from "../../CommonComponents/Button/GobackButton";
import useModal from "../../CommonComponents/Modal/modal";
import { useHomeController } from "../../HomeContext";
import "./task-form.css";

function TaskForm(props) {
  const taskModes = {
    Expense: { id: 0, name: "Expense" },
    Income: { id: 1, name: "Income" },
  };

  const [selectedTaskMode, setSelectedTaskMode] = useState(taskModes.Income);
  const [selectedCurrency, setSelectedCurrency] = useState(); 

  const {
    localCountryInfo,
    accountCategories,
    incomeCategories,
    expenseCategories,
  } = useHomeController();

  const {
    handleClose,
    handleShow,
    setIModalStates,
    ModalComponent    
  } = useModal();
  
  const [selectedTask, setSelectedTask] = useState({
    title: null,
    date: null,
    accountCategory: null,
    taskCategory: null,
    amount: null,
    note: null,
  });

  const titleRef = useRef(),
    dateRef = useRef(),
    accountCategoryRef = useRef(),
    taskCategoryRef = useRef(),
    amountRef = useRef(),
    noteRef = useRef();

  const handleSelectMode = (mode) => setSelectedTaskMode(mode);

  const handleSubmit = (event) => {};

  const handleDisplayAccountCategoryModal = () => {
    accountCategoryRef.current.blur();

    let content = (
      <div className="category-group">
        {accountCategories &&
          accountCategories.map((category) => (
            <BorderButton
              key={category.id}
              backgroundColor={"transparent"}
              border={{ size: 2, color: "#ffae49" }}
              onClick={() => handleSelectAccountCateogory(category)}
            >
              {category.name}
            </BorderButton>
          ))}
      </div>
    );

    setIModalStates({content: content, title: "Account category"});
    handleShow();
  };

  const handleSelectAccountCateogory = (accountCategory) => {
    accountCategoryRef.current.value = accountCategory.name;
    setSelectedTask({ ...selectedTask, accountCategory: accountCategory });

    handleClose();
  };

  const handleDisplayTaskCategoryModal = () => {
    taskCategoryRef.current.blur();

    let title = null;
    let categories = null;

    if (selectedTaskMode.id === taskModes.Income.id) {
      title = "Income category";
      categories = incomeCategories;
    }

    if (selectedTaskMode.id === taskModes.Expense.id) {
      title = "Expense category";
      categories = expenseCategories;
    }

    let content = (
      <div className="category-group">
        {categories &&
          categories.map((category) => (
            <BorderButton
              key={category.id}
              backgroundColor={"transparent"}
              border={{ size: 2, color: "#ffae49" }}
              onClick={() => handleSelectTaskCateogory(category)}
            >
              {category.name}
            </BorderButton>
          ))}
      </div>
    );

    setIModalStates({ content: content, title: title });

    handleShow();
  };

  const handleSelectTaskCateogory = (taskCategory) => {
    taskCategoryRef.current.value = taskCategory.name;
    setSelectedTask({ ...selectedTask, taskCategory: taskCategory });

    handleClose();
  };

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

  const handleCurrencyInputExchange = () => {
    let modalContent = (
      <div className="table task-form__currency-table-wrapper">
        <table className="table task-form__currency-table">
          <tbody>
            {
               localCountryInfo && 
               localCountryInfo.currencyExchangeRate && 
               Object.keys(localCountryInfo.currencyExchangeRate).map(key => <tr key={key} 
                                                                            className={key === localCountryInfo.currency ? "currency--active" : ''}>
                    <td>{key}</td>
                    <td className="text-end">{localCountryInfo.currencyExchangeRate[key]}</td>
               </tr>) 
            }
          </tbody>
        </table>
      </div>
    );

    setIModalStates({content: modalContent, title: "Currency Setting", fullscreen: true});
    handleShow();
  };

  useEffect(() => {
    dateRef.current.value = getFormatDateForDatePicker();
  });

  useEffect(() => {
        if(localCountryInfo && !selectedCurrency){
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
              <span
                className="task-form__amount-input-icon"
                onClick={handleCurrencyInputExchange}
              >
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
