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
function TaskForm(props) {
  // #region State

  const { mode, id: formId } = useParams();
  const history = useHistory();

  // Store select task mode.
  // Available task mode : income, expense.
  const [selectedTaskMode, setSelectedTaskMode] = useState(taskModes.Income);

  // Store Form-Task value.
  const [selectedTask, setSelectedTask] = useState({
    accountCate: {},
    taskCate: {},
    amount: parseFloat(0),
    currency: null,
  });

  // Define Form Refs
  const titleRef = useRef(),
    dateRef = useRef(),
    accountCategoryRef = useRef(),
    taskCategoryRef = useRef(),
    amountRef = useRef(),
    noteRef = useRef();

  // Store selected task id if Form is in edit mode.
  const selectedTaskId = useRef();

  // Get loading animantion, alert message from home-Controller.
  const {
    setLoading,
    localCountryInfo,
    handleErrorShow,
    setErrorModalContent,
  } = useHomeController();

  // Database methods.
  const { addDocument, updateDocument, getDocumentById } = useFirestore(
    DatabaseCollections.Tasks
  );

  // Define account category, task category, currency modal
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

      let task = {
        ...selectedTask,
        date: dateRef.current.value,
        note: noteRef.current.value,
        title: titleRef.current.value,
        type: selectedTaskMode,
      };

      setLoading(true);

      if (mode === "add") await addDocument(task);
      if (mode === "edit") await updateDocument(task, selectedTaskId.current);

      setLoading(false);

      history.push(`/daily/${dateRef.current.value}`);
    } catch (error) {
      setErrorModalContent(error);
      handleErrorShow();
    }
  };

  // Handle Open Modals event.
  const handleDisplayAccountCategoryModal = () => {
    accountCategoryRef.current.blur();
    handleAccountCateShow();
  };

  const handleSelectAccountCategory = (category) => {
    setSelectedTask({ ...selectedTask, accountCate: category });
    accountCategoryRef.current.value = category.name;
  };

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

  // Set Default currency base by local informations
  useEffect(() => {
    if (localCountryInfo && !selectedTask.currency) {
      setSelectedTask({ ...selectedTask, currency: localCountryInfo.currency });
    }
  }, [localCountryInfo]);

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
      setSelectedTask({ ...selectedTask, amount: 0 });
      return;
    }

    currentValue = currentValue.replaceAll(",", "");

    // If new input character is not number => remove it.
    if (isNaN(Number(currentValue))) {
      amountRef.current.value = 0;
      setSelectedTask({ ...selectedTask, amount: 0 });
      return;
    }

    if (currentValue.includes(".", currentValue.length - 1)) return;

    let formatedCurrency = convertNumberWithCommas(Number(currentValue));

    amountRef.current.value = formatedCurrency;
    setSelectedTask({
      ...selectedTask,
      amount: parseFloat(currentValue),
    });
  };

  /**
   * Init date-picker value when task mode is add,
   * Otherwise date-picker value will be inited by below useEffect.
   */
  useEffect(() => {
    if (mode === "add" && formId) {
      dateRef.current.value = getFormatDateForDatePicker(new Date(formId));
    }
  }, []);

  /**
   * Init task values when task mode is edit.
   * Change selectedTask values, selectedTaskId value.
   */
  useEffect(() => {
    if (mode === "edit" && formId) {
      initTaskById();
    }
  }, []);

  const initTaskById = async () => {
    try {
      setLoading(true);

      const doc = await getDocumentById(formId);
      const task = doc.data;

      // Init State values.
      setSelectedTask(task);
      selectedTaskId.current = doc.id;

      // Init Form Refs values.
      dateRef.current.value = task.date;
      accountCategoryRef.current.value = task.accountCate.name;
      taskCategoryRef.current.value = task.taskCate.name;

      amountRef.current.value = convertNumberWithCommas(Number(task.amount));

      titleRef.current.value = task.title;
      noteRef.current.value = task.note;

      // Init Task Mode.
      setSelectedTaskMode(task.type);
    } catch (error) {
      setErrorModalContent(JSON.stringify(error));
      handleErrorShow();
    } finally {
      setLoading(false);
    }
  };

  // #endregion Function

  return (
    <div className="task-form">
      <div className="task-form__header">
        <GobackButton backgroundColor={"transparent"} callback={history.goBack}>
          Go back
        </GobackButton>
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
