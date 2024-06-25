import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../Button/BorderButton";
import { CustomButton } from "../Button/Button";
import "./modal.css";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";
import { useHomeController } from "../../HomeContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";
import { Timestamp } from "firebase/firestore";
import { useEffect } from "react";

/**
 * Custom React-Bootstrap modal component. Use when display success messages modal.
 * Returns open, close, set message content Func and modal component.
 */
export function useSuccessModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  // #endregion State

  // #region Function
  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const setSucessModalContent = (content) => setContent(content);
  // #endregion Function

  const SuccessModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon far fa-check-circle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton onClick={handleClose}>Close</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    SuccessModal,
    setSucessModalContent,
  };
}

/**
 * Custom React-Bootstrap modal component. Use when display error messages modal.
 * Returns open, close, set message content Func and modal component.
 */
export function useErrorModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  // #endregion State

  // #region Function
  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const setErrorModalContent = (content) => setContent(content);
  // #endregion Function

  const ErrorModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton onClick={handleClose}>CLose</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ErrorModal,
    setErrorModalContent,
  };
}

/**
 * Custom React-Bootstrap modal component. Use when display confirm messages modal.
 * Returns open, close, set message content Func and modal component.
 */
export function useConfirmModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const [callback, setCallback] = useState();
  // #endregion State

  // #region Func
  const handleShow = (callback) => {
    setShow(true);
    setCallback(() => callback);
  };

  const handleClose = () => setShow(false);

  const submit = () => {
    if (callback) callback();
    handleClose();
  };

  const setConfirmModalContent = (content) => setContent(content);
  // #endregion Func

  const ConfirmModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>
            Cancel
          </BorderButton>
          <CustomButton onClick={submit}>Yes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ConfirmModal,
    setConfirmModalContent,
  };
}

/**
 * Custom React-Bootstrap modal component. Use when display confirm messages modal.
 * Returns open, close, set message content Func and modal component.
 */
export function useEditBudgetModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const [callback, setCallback] = useState();
  const budgetRef = useRef();
  // #endregion State

  // #region Func
  const handleShow = (callback) => {
    setShow(true);
    setCallback(() => callback);
  };

  const handleClose = () => setShow(false);

  const submit = () => {
    if (callback) callback();
    handleClose();
  };

  const setEditBudgetModalContent = (budget) => {

  };
  
  // #endregion Func

  const EditBudgetModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>
            Cancel
          </BorderButton>
          <CustomButton onClick={submit}>Yes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    EditBudgetModal,
    setEditBudgetModalContent,
  };
}

export function useConfirmSyncStartDateModal() {
  // #region State
  const [show, setShow] = useState(false);
  const setCallbackRef = useRef(null);
  const datePickerRef = useRef();
  // #endregion State

  // #region Func
  const handleShow = (callback) => {
    setShow(true);
    setCallbackRef.current = callback;
  };

  const handleClose = () => setShow(false);

  const submit = () => {
    setCallbackRef.current(datePickerRef.current.value);
    handleClose();
  };

  const setConfirmSyncStartDate = (date, callback) => {
    if(date) datePickerRef.current = date;
    setCallbackRef.current = callback;
  };

  // #endregion Func

  const ConfirmSyncStartDateModal = () => {
    useEffect(() => {
      let currDate = new Date();
      datePickerRef.current.value = currDate.toISOString().split("T")[0];
    }, []);

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <div style={{ marginLeft: "1em" }}>
              <p className="modal-body__p">Please select start date : </p>
              <input
                className="form-control navigator__date-picker"
                type="date"
                ref={datePickerRef}
                autoComplete={"off"}
              />
            </div>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>
            Cancel
          </BorderButton>
          <CustomButton onClick={submit}>Yes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ConfirmSyncStartDateModal,
    setConfirmSyncStartDate,
  };
}

function ListItem({ name, value = false, updateValue = () => {}, children }) {
  // handle checkbox change
  const handleChange = () => {
    updateValue(!value, name);
  };

  return (
    <input
      type="checkbox"
      id={`${name}-checkbox`}
      name={name}
      checked={value}
      onChange={handleChange}
    />
  );
}

export function useConfirmMailSyncModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const [expenseCategories, setExpenseCategories] = useState();
  const [accountCategories, setAccountCategories] = useState();
  const setLoadingRef = useRef(null);
  const history = useHistory();
  const contentCheckboxRef = useRef(null);
  const dateRef = useRef(null);

  const {
    getDocumentById: getBudgetById,
    addDocumentWithId: addBudget,
    updateDocument: updateBudgetById,
  } = useFirestore(DatabaseCollections.Budgets);

  const {
    getDocuments: getLastSyncMailDate,
    addDocument: addSyncMailDate,
    updateDocument: updateSyncMailDate,
  } = useFirestore(DatabaseCollections.MailSyncDate);

  const { addDocument: addTask } = useFirestore(DatabaseCollections.Tasks);

  // #endregion State

  // #region Func
  const handleShow = (callback) => {
    setShow(true);
  };

  const handleClose = () => setShow(false);

  const submit = async () => {
    setLoadingRef.current(true);

    for (var [idx, task] of content.entries()) {
      if (contentCheckboxRef.current[idx].isChecked === false) continue;

      await addTask(task);

      let amount = parseFloat(task.amount);
      let budget = await getBudgetById(task.accountCate.id);

      if (budget && budget.data) {
        let calAmount = parseFloat(budget.data.amount) - amount;
        await updateBudgetById(
          { ...budget.data, amount: calAmount },
          budget.id
        );
      }
    }

    const currentDate = new Date();

    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, "0"); // Adding 1 to the month because months are zero-based
    const day = currentDate.getDate().toString().padStart(2, "0");
    const lastDate = `${year}/${month}/${day}`;
   
    await updateSyncMailDate(
      { ...dateRef.current.data, date: lastDate },
      dateRef.current.id
    );

    setLoadingRef.current(false);

    handleClose();
    history.push("/budgets");
  };

  const setConfirmMailSyncModalContent = (
    content,
    expenseCategories,
    accountCategories,
    setLoading,
    lastDate
  ) => {
    content.forEach((task) => {
      let firebaseDate = Timestamp.fromDate(
        new Date(task.date.replace(/\//g, "-"))
      );

      task.taskCate = expenseCategories[0];
      task.accountCate = accountCategories[0];
      task.type = { id: 0, name: "Expense", type: "expense" };
      task.currency = "JPY";
      task.note = "";
      task.date = task.date.replace(/\//g, "-");
      task.formatedDate = firebaseDate;
      task.isChecked = false;
    });

    setAccountCategories(accountCategories);
    setExpenseCategories(expenseCategories);
    setLoadingRef.current = setLoading;
    setContent(content);
    contentCheckboxRef.current = content;
    dateRef.current = lastDate;
  };
  // #endregion Func

  const ConfirmMailSyncModal = () => {
    const handleCheckboxChange = (id) => {
      const updatedItems = contentCheckboxRef.current.map((mail, idx, arr) => {
        if (idx === id) {
          return { ...mail, isChecked: !mail.isChecked };
        }
        return mail;
      });

      contentCheckboxRef.current = updatedItems;
    };

    const onChangeExpenseCate = (cate, arrIdx) => {
      const taskCate = expenseCategories.find((e) => e.id === cate);
      content[arrIdx].taskCate = taskCate;
    };

    const onChangeAccountCate = (cate, arrIdx) => {
      const accountCate = accountCategories.find((e) => e.id === cate);
      content[arrIdx].accountCate = accountCate;
    };

    const [selected, setSelected] = useState([]);
    const checkAllRef = useRef(null);

    function handleSelect(value, id) {
      if (value) {
        setSelected([...selected, id]);
      } else {
        setSelected(selected.filter((item) => item !== id));
      }

      handleCheckboxChange();
    }

    function selectAll() {
      var isCheck = checkAllRef.current.checked;

      if (!isCheck) {
        setSelected([]);

        const updatedItems = contentCheckboxRef.current.map(
          (mail, idx, arr) => {
            return { ...mail, isChecked: false };
          }
        );
        contentCheckboxRef.current = updatedItems;

        return;
      }

      const newCheckAll = [];
      for (var i = 0; i < content.length; i++) {
        newCheckAll.push(i);
      }

      const updatedItems = contentCheckboxRef.current.map((mail, idx, arr) => {
        return { ...mail, isChecked: true };
      });
      contentCheckboxRef.current = updatedItems;

      setSelected(newCheckAll);
    }

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton></Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">
              This following task have not sync to app :
            </p>
          </div>
          <div style={{ overflow: "auto", height: "65vh" }}>
            <table className="table">
              <thead>
                <tr>
                  <th>
                    <input
                      type="checkbox"
                      ref={checkAllRef}
                      onChange={selectAll}
                    />
                  </th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    Expense Categories
                  </th>
                  <th scope="col" style={{ whiteSpace: "nowrap" }}>
                    Account Categories
                  </th>
                  <th scope="col">Shop</th>
                  <th scope="col">Amount</th>
                  <th scope="col">Date</th>
                </tr>
              </thead>
              <tbody>
                {content.map(function (mail, idx, arr) {
                  return (
                    <tr key={idx}>
                      <td>
                        <ListItem
                          name={idx}
                          value={selected.includes(idx)}
                          updateValue={handleSelect}
                        />
                      </td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) =>
                            onChangeExpenseCate(e.target.value, idx)
                          }
                        >
                          {expenseCategories.map((cate) => (
                            <option value={cate.id} key={cate.id}>
                              {cate.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) =>
                            onChangeAccountCate(e.target.value, idx)
                          }
                        >
                          {accountCategories.map((cate) => (
                            <option value={cate.id} key={cate.id}>
                              {cate.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td scope="row">{mail.shop}</td>
                      <td>{mail.amount}</td>
                      <td style={{ whiteSpace: "nowrap" }}>{mail.date}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>
            Cancel
          </BorderButton>
          <CustomButton onClick={submit}>Yes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ConfirmMailSyncModal,
    setConfirmMailSyncModalContent,
  };
}
