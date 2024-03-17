import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../Button/BorderButton";
import { CustomButton } from "../Button/Button";
import "./modal.css";
import { DatabaseCollections, useFirestore } from "../../../Database/useFirestore";
import { useHomeController } from "../../HomeContext";
import { useHistory } from "react-router-dom/cjs/react-router-dom";

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

export function useConfirmMailSyncModal() {
  // #region State
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const [expenseCategories, setExpenseCategories] = useState();
  const [accountCategories, setAccountCategories] = useState();
  const setLoadingRef = useRef(null);
  const history = useHistory();

  const {
    getDocumentById: getBudgetById,
    addDocumentWithId: addBudget,
    updateDocument: updateBudgetById,
  } = useFirestore(DatabaseCollections.Budgets);

  const { addDocument: addTask } = useFirestore(DatabaseCollections.Tasks);

  // #endregion State

  // #region Func
  const handleShow = (callback) => {
    setShow(true);
  };

  const handleClose = () => setShow(false);
  
  const submit = async() => {
    setLoadingRef.current(true);
    
    for (var task of content) {
      await addTask(task);

      let amount = parseFloat(task.amount);
      let budget = await getBudgetById(task.accountCate.id);

      if (budget && budget.data) {
        let calAmount = parseFloat(budget.data.amount) - amount;
        await updateBudgetById({ ...budget.data, amount: calAmount }, budget.id);
      }
    }

    setLoadingRef.current(false);

    handleClose();
    history.push('/budgets');
  };

  const setConfirmMailSyncModalContent = (
    content,
    expenseCategories,
    accountCategories,
    setLoading,
  ) => {
    content.forEach(task => {
      task.taskCate = expenseCategories[0];
      task.accountCate = accountCategories[0];
      task.type = {id: 0, name: 'Expense', type: 'expense'};
      task.currency = "JPY";
      task.note = "";
      task.date = task.date.replace(/\//g, '-');
    });

    setAccountCategories(accountCategories);
    setExpenseCategories(expenseCategories);
    setLoadingRef.current = setLoading;
    setContent(content);
  };
  // #endregion Func

  const ConfirmMailSyncModal = () => {
    const onChangeExpenseCate = (cate, arrIdx) => {
         const taskCate = expenseCategories.find(e => e.id === cate);
         content[arrIdx].taskCate = taskCate;
    };
  
    const onChangeAccountCate = (cate, arrIdx) => {
         const accountCate = accountCategories.find(e => e.id === cate);
         content[arrIdx].accountCate = accountCate;
    };

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
          <div style={{overflow: 'auto'}}>
            <table className="table">
              <thead>
                <tr>
                  <th scope="col">Expense Categories</th>
                  <th scope="col">Account Categories</th>
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
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => onChangeExpenseCate(e.target.value, idx)}
                        >
                          {expenseCategories.map((cate) => (
                            <option value={cate.id} key={cate.id}>{cate.name}</option>
                          ))}
                        </select>
                      </td>
                      <td>
                        <select
                          className="form-select"
                          aria-label="Default select example"
                          onChange={(e) => onChangeAccountCate(e.target.value, idx)}
                        >
                          {accountCategories.map((cate) => (
                            <option value={cate.id} key={cate.id}>{cate.name}</option>
                          ))}
                        </select>
                      </td>
                      <td scope="row">{mail.shop}</td>
                      <td>{mail.amount}</td>
                      <td>{mail.date}</td>
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
