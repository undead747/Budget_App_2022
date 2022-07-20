import React, { useEffect, useRef, useState } from "react";
import { ButtonGroup, Form } from "react-bootstrap";
import { useHistory } from "react-router-dom";
import { taskModes } from "../../../Constants/TaskConstaints";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import {
  convertNumberToCurrency,
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

function TaskForm(props) {
  const [selectedTaskMode, setSelectedTaskMode] = useState(taskModes.Income);
  const [selectedTask, setSelectedTask] = useState({
    date: null,
    accountCate: {},
    taskCate: {},
    amount: 0,
    currency: null,
    title: null,
    note: null,
  });

  // State data from home controller
  const {setLoading, localCountryInfo, handleSuccessShow, setSucessModalContent } = useHomeController();
  const {addDocument} = useFirestore(DatabaseCollections.Tasks);

  // Define form refs
  const titleRef = useRef(),
    dateRef = useRef(),
    accountCategoryRef = useRef(),
    taskCategoryRef = useRef(),
    amountRef = useRef(),
    noteRef = useRef();

  const {
    show: accountModalShow,
    handleShow: handleAccountCateShow,
    AccountCategoryModal,
  } = useAccountCategoryModal();
  const {
    show: taskModalShow,
    handleShow: handleTaskCateShow,
    TaskCategoryModal,
  } = useTaskCategoryModal();
  const {
    show: CurrencyModalShow,
    handleShow: handleCurrencyShow,
    CurrencyModal,
  } = useCurrencyModal();

  const history = useHistory();

  const handleSelectMode = (mode) => setSelectedTaskMode(mode);

  const handleSubmit = async(event) => {
    try {
      event.preventDefault();
      let task = {
        ...selectedTask,
        date: dateRef.current.value,
        note: noteRef.current.value,
        title: titleRef.current.value,
      };
      
      setLoading(true);
      await addDocument(JSON.parse(JSON.stringify(task)));
      setLoading(false);
      history.push('/');
    } catch (error) {
      console.log(error)      
    }
  };

  // Handle Account Categories Modal
  const handleDisplayAccountCategoryModal = () => {
    accountCategoryRef.current.blur();
    handleAccountCateShow();
  };

  const handleSelectAccountCategory = (category) => {
    setSelectedTask({ ...selectedTask, accountCate: category });
    accountCategoryRef.current.value = category.name;
  };

  //Handle Task Cateogries Modal
  const handleDisplayTaskCategoryModal = () => {
    taskCategoryRef.current.blur();
    handleTaskCateShow();
  };

  const handleSelectTaskCategory = (category) => {
    setSelectedTask({ ...selectedTask, taskCate: category });
    taskCategoryRef.current.value = category.name;
  };

  const handleDisplayCurrencyModal = () => {
    handleCurrencyShow();
  };

  // Format money real-time when user input money
  const handleCurrencyInputEvent = (event) => {
    let currentValue = amountRef.current.value;

    if (!currentValue) {
      amountRef.current.value = 0;
      setSelectedTask({ ...selectedTask, amount: 0 });
      return;
    }

    if (
      selectedTask.currency &&
      !currentValue.includes(".", currentValue.length - 1)
    ) {
      let convertedCurrency = convertNumberToCurrency(
        selectedTask.currency,
        currentValue
      );

      if (isNaN(parseFloat(convertedCurrency))) {
        amountRef.current.value = currentValue.slice(0, -1);
        return;
      }

      amountRef.current.value = convertedCurrency;
      setSelectedTask({
        ...selectedTask,
        amount: convertedCurrency.replace(",", ""),
      });
    }
  };

  // Set Default task date by current local date
  useEffect(() => {
    dateRef.current.value = getFormatDateForDatePicker();
  });

  // Set Default currency base by local informations
  useEffect(() => {
    if (localCountryInfo && !selectedTask.currency) {
      setSelectedTask({ ...selectedTask, currency: localCountryInfo.currency });
    }
  }, [localCountryInfo]);

  return (
    <div className="task-form">
      <div className="task-form__header">
        <GobackButton backgroundColor={"transparent"} callback={history.goBack}>Go back</GobackButton>
        <h5 className="task-form__title">{selectedTaskMode.name}</h5>
      </div>

      <ButtonGroup className="task-form__button-group">
        {Object.keys(taskModes).map((key) => {
          if (taskModes[key].id === selectedTaskMode.id)
            return <CustomButton key={key}>{taskModes[key].name}</CustomButton>;

          return (
            <BorderButton
              border={{ size: 2 }}
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
                onClick={handleDisplayCurrencyModal}
              >
                {selectedTask.currency &&
                  getSymbolByCurrency(selectedTask.currency)}
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

      {accountModalShow && (
        <AccountCategoryModal callback={handleSelectAccountCategory} />
      )}
      {taskModalShow && (
        <TaskCategoryModal
          callback={handleSelectTaskCategory}
          selectedTaskMode={selectedTaskMode}
        />
      )}
      {CurrencyModalShow && (
        <CurrencyModal
          amountRef={amountRef}
          setSelectedTask={setSelectedTask}
          selectedTask={selectedTask}
        />
      )}
    </div>
  );
}

export default TaskForm;
