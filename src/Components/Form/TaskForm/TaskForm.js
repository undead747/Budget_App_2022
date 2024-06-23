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

  const [selectedTransfer, setSelectedTransfer] = useState({
    fromIncomeCate: {},
    toIncomeCate: {},
    amount: parseFloat(0),
    currency: null,
  });

  // Define Form Refs
  const titleRef = useRef(),
    dateRef = useRef(),
    accountCategoryRef = useRef(),
    taskCategoryRef = useRef(),
    amountRef = useRef(),
    fromIcomeRef = useRef(),
    toIncomeRef = useRef(),
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

  const {
    getDocumentById: getBudgetById,
    addDocumentWithId: addBudget,
    updateDocument: updateBudget,
  } = useFirestore(DatabaseCollections.Budgets);

  const {
    getDocumentById: getTransferById,
    addDocument: insertTransfer,
    updateDocument: updateTransfer,
  } = useFirestore(DatabaseCollections.Transfer);

  // Define account category, task category, currency modal
  const {
    show: accountModalShow,
    handleShow: handleAccountCateShow,
    AccountCategoryModal,
  } = useAccountCategoryModal();

  const {
    show: fromIncomeCateModalShow,
    handleShow: handleFromIncomeCateShow,
    AccountCategoryModal: FromIncomeCategoryModal,
  } = useAccountCategoryModal();

  const {
    show: toIncomeCateModalShow,
    handleShow: handleToIncomeCateShow,
    AccountCategoryModal: ToIncomeCategoryModal,
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
      let firebaseDate = Timestamp.fromDate(new Date(dateRef.current.value));

      let task = {
        ...selectedTask,
        date: dateRef.current.value,
        formatedDate: firebaseDate,
        note: noteRef.current.value,
        title: titleRef.current.value,
        type: selectedTaskMode,
      };

      setLoading(true);
      if (mode === "add") await addTask(task);
      if (mode === "edit") await updateTask(task, selectedTaskId.current);

      history.push(`/daily/${dateRef.current.value}`);
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }finally{
      setLoading(false);
    }
  };

  /**
   * Handle submit event.
   * @param {object} event - triggered submit button.
   */
  const handleTransferSubmit = async (event) => {
    try {
      event.preventDefault();

      let firebaseDate = Timestamp.fromDate(new Date(dateRef.current.value));

      let transfer = {
        ...selectedTransfer,
        date: dateRef.current.value,
        formatedDate: firebaseDate,
        note: noteRef.current.value,
      };

      setLoading(true);
      await addTransfer(transfer);
      
      history.push(`/daily/${dateRef.current.value}`);
    } catch (error) {
      setErrorModalContent(error.message);
      handleErrorShow();
    }finally{
      setLoading(false);
    }
  };

  const addTransfer = async (transfer) => {
    
    let rates = await getCurrencyRateByCode(localCountryInfo.currency);
    let amount = parseFloat(transfer.amount);
    if (
      transfer.currency !== localCountryInfo.currency &&
      rates[transfer.currency]
    ) {
      amount = amount / parseFloat(rates[transfer.currency]);
    }

    let fromCateBudget = await getBudgetById(transfer.fromIncomeCate.id);
    let toCateBudget = await getBudgetById(transfer.toIncomeCate.id);

    if (!fromCateBudget || !fromCateBudget.data) {
      throw new Error(`Can not transfer '${transfer.fromIncomeCate.name}' budget with amount lower than 0.`);
    }

    let calAmount = parseFloat(fromCateBudget.data.amount) - amount;
    await updateBudget(
      { ...fromCateBudget.data, amount: calAmount },
      fromCateBudget.id
    );
    
    if(toCateBudget && toCateBudget.data){
      calAmount = parseFloat(toCateBudget.data.amount) + amount;
      await updateBudget(
        { ...toCateBudget.data, amount: calAmount },
        toCateBudget.id
        );
      }else{
        let budget = {
        name: transfer.toIncomeCate.name,
        amount: amount,
      };
      
      await addBudget(budget, transfer.toIncomeCate.id);      
    }
    
    await insertTransfer(transfer);
  };

  const addTask = async (task) => {
    await addDocument(task);

    let rates = await getCurrencyRateByCode(localCountryInfo.currency);
    let amount = parseFloat(task.amount);
    if (task.currency !== localCountryInfo.currency && rates[task.currency]) {
      amount = amount / parseFloat(rates[task.currency]);
    }

    let budget = await getBudgetById(task.accountCate.id);

    if (task.type.id === taskModes.Income.id) {
      if (budget && budget.data) {
        let calAmount = parseFloat(budget.data.amount) + amount;
        await updateBudget({ ...budget.data, amount: calAmount }, budget.id);
      } else {
        let budget = {
          name: task.accountCate.name,
          amount: amount,
        };

        await addBudget(budget, task.accountCate.id);
      }
    }

    if (task.type.id === taskModes.Expense.id) {
      if (budget && budget.data) {
        let calAmount = parseFloat(budget.data.amount) - amount;
        await updateBudget({ ...budget.data, amount: calAmount }, budget.id);
      }
    }
  };

  const updateTask = async (newTask, taskId) => {
    let oldTask = await getDocumentById(taskId);
    let rates = await getCurrencyRateByCode(localCountryInfo.currency);

    let oldAmmount = parseFloat(oldTask.data.amount);
    let newAmmount = parseFloat(newTask.amount);

    oldTask = oldTask.data;

    let oldTaskBudget = await getBudgetById(oldTask.accountCate.id);

    if (
      oldTask.currency !== localCountryInfo.currency &&
      rates[oldTask.currency]
    ) {
      oldAmmount = oldAmmount / parseFloat(rates[oldTask.currency]);
    }

    if (
      newTask.currency !== localCountryInfo.currency &&
      rates[newTask.currency]
    ) {
      newAmmount = newAmmount / parseFloat(rates[newTask.currency]);
    }

    if (oldTask.type.id === taskModes.Income.id) {
      if (oldTaskBudget && oldTaskBudget.data) {
        let calAmount = parseFloat(oldTaskBudget.data.amount) - oldAmmount;
        await updateBudget(
          { ...oldTaskBudget.data, amount: calAmount },
          oldTaskBudget.id
        );
      }
    }

    if (oldTask.type.id === taskModes.Expense.id) {
      if (oldTaskBudget && oldTaskBudget.data) {
        let calAmount = parseFloat(oldTaskBudget.data.amount) + oldAmmount;
        await updateBudget(
          { ...oldTaskBudget.data, amount: calAmount },
          oldTaskBudget.id
        );
      }
    }

    let newTaskBudget = await getBudgetById(newTask.accountCate.id);

    if (newTask.type.id === taskModes.Income.id) {
      if (newTaskBudget && newTaskBudget.data) {
        let calAmount = parseFloat(newTaskBudget.data.amount) + newAmmount;
        await updateBudget(
          { ...newTaskBudget.data, amount: calAmount },
          newTaskBudget.id
        );
      }
    }

    if (newTask.type.id === taskModes.Expense.id) {
      if (newTaskBudget && newTaskBudget.data) {
        let calAmount = parseFloat(newTaskBudget.data.amount) - newAmmount;
        await updateBudget(
          { ...newTaskBudget.data, amount: calAmount },
          newTaskBudget.id
        );
      }
    }

    await updateDocument(newTask, taskId);
  };

  // Handle Open Modals event.
  const handleDisplayFromAccountCategoryModal = () => {
    fromIcomeRef.current.blur();
    handleFromIncomeCateShow();
  };

  const handleDisplayToAccountCategoryModal = () => {
    toIncomeRef.current.blur();
    handleToIncomeCateShow();
  };

  const handleDisplayAccountCategoryModal = () => {
    accountCategoryRef.current.blur();
    handleAccountCateShow();
  };

  const handleSelectAccountCategory = (category) => {
    setSelectedTask({ ...selectedTask, accountCate: category });
    accountCategoryRef.current.value = category.name;
  };

  const handleSelectFromAccountCategory = (category) => {
    setSelectedTransfer({ ...selectedTransfer, fromIncomeCate: category });
    fromIcomeRef.current.value = category.name;
  };

  const handleSelectToAccountCategory = (category) => {
    setSelectedTransfer({ ...selectedTransfer, toIncomeCate: category });
    toIncomeRef.current.value = category.name;
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
      setSelectedTransfer({ ...selectedTransfer, amount: 0 });
      return;
    }

    currentValue = currentValue.replaceAll(",", "");

    // If new input character is not number => remove it.
    if (isNaN(Number(currentValue))) {
      amountRef.current.value = 0;
      setSelectedTask({ ...selectedTask, amount: 0 });
      setSelectedTransfer({ ...selectedTransfer, amount: 0 });
      return;
    }

    if (currentValue.includes(".", currentValue.length - 1)) return;

    let formatedCurrency = convertNumberWithCommas(Number(currentValue));

    amountRef.current.value = formatedCurrency;
    setSelectedTask({
      ...selectedTask,
      amount: parseFloat(currentValue),
    });
    setSelectedTransfer({
      ...selectedTransfer,
      amount: parseFloat(currentValue),
    });
  };

  /**
   * Init date-picker value when task mode is add,
   * Otherwise date-picker value will be inited by below useEffect.
   */
  useEffect(() => {
    if (mode === "add") {
      if (formId)
        dateRef.current.value = getFormatDateForDatePicker(new Date(formId));
      else dateRef.current.value = getFormatDateForDatePicker(new Date());

      if (localCountryInfo && !selectedTask.currency) {
        setSelectedTask({
          ...selectedTask,
          currency: localCountryInfo.currency,
        });

        setSelectedTransfer({
          ...selectedTransfer,
          currency: localCountryInfo.currency,
        });
      }
    }

    if (mode === "edit") {
      initTaskById();
    }
  }, [localCountryInfo]);

  const initTaskById = async () => {
    if (!formId) return;

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
          <h5 className="task-form__title">{selectedTaskMode.name}</h5>
        </div>

        <ButtonGroup className="task-form__button-group">
          {Object.keys(taskModes).map((key) => {
            if (taskModes[key].id === selectedTaskMode.id)
              return (
                <CustomButton key={key}>{taskModes[key].name}</CustomButton>
              );

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
          {selectedTaskMode.id === taskModes.Transfer.id && (
            <Form onSubmit={handleTransferSubmit}>
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
                  From
                </label>
                <input
                  className="form-control"
                  onClick={handleDisplayFromAccountCategoryModal}
                  type="text"
                  ref={fromIcomeRef}
                  required
                />
              </div>

              <div className="mb-3">
                <label htmlFor="account-category" className="form-label">
                  To
                </label>
                <input
                  className="form-control"
                  onClick={handleDisplayToAccountCategoryModal}
                  type="text"
                  ref={toIncomeRef}
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
                <CustomButton type="submit">{mode}</CustomButton>
              </div>
            </Form>
          )}

          {selectedTaskMode.id !== taskModes.Transfer.id && (
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
                <CustomButton type="submit">{mode}</CustomButton>
              </div>
            </Form>
          )}
        </div>

        {fromIncomeCateModalShow && (
          <FromIncomeCategoryModal callback={handleSelectFromAccountCategory} />
        )}
        {toIncomeCateModalShow && (
          <ToIncomeCategoryModal callback={handleSelectToAccountCategory} />
        )}
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
    </div>
  );
}

export default TaskForm;
