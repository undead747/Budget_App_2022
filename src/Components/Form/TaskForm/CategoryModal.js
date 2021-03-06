import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { useHomeController } from "../../HomeContext";
import { taskModes } from "../../../Constants/TaskConstaints";

/**
 * Custom React-Bootstrap modal component. Use when display account category modal.  
 * Returns open, close, modal component.
 */
export function useAccountCategoryModal() {
  // #region State 
  const [show, setShow] = useState(false);
  // #endregion State 

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const AccountCategoryModal = ({ callback }) => {
    // #region State 
    const { accountCategories } = useHomeController();
    // #endregion State 

    // #region Function
    const handleSubmit = (category) => {
      handleClose();
      if (callback) callback(category);
    };
    // #endregion Function 

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        size={"lg"}
        className={"default-mode"}
      >
        <Modal.Header closeButton>
          <Modal.Title>Account Categories</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="category-group">
            {accountCategories &&
              accountCategories.map((category) => (
                <BorderButton
                  key={category.id}
                  backgroundColor={"transparent"}
                  border={{ size: 2, color: "#ffae49" }}
                  onClick={() => handleSubmit(category)}
                >
                  {category.name}
                </BorderButton>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    AccountCategoryModal
  }
}

/**
 * Custom React-Bootstrap modal component. Use when display task category modal.  
 * Returns open, close, modal component.
 */
export function useTaskCategoryModal() {
  // #region State 
  const [show, setShow] = useState(false);
  // #endregion State 

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const TaskCategoryModal = ({ callback, selectedTaskMode, ...rest }) => {
    // #region State 
    const { incomeCategories, expenseCategories } = useHomeController();
    const [categories, setCategories] = useState();
    // #endregion State 

    // #region Function 
    const displayModalTitle = () => {
      if (selectedTaskMode.id === taskModes.Expense.id) return "Expense Categories";
      if (selectedTaskMode.id === taskModes.Income.id) return "Income Categories";
    }

    useEffect(() => {
      if (incomeCategories && expenseCategories) {
        if (selectedTaskMode.id === taskModes.Expense.id) {
          setCategories(expenseCategories);
          return
        }

        if (selectedTaskMode.id === taskModes.Income.id) {
          setCategories(incomeCategories);
          return
        }
      }
    }, [incomeCategories, expenseCategories])

    const handleSubmit = (category) => {
      handleClose();
      if (callback) callback(category);
    };
    // #endregion Function 

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        size={"lg"}
        className={"default-mode"}
      >
        <Modal.Header closeButton>
          <Modal.Title>{displayModalTitle()}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <div className="category-group">
            {categories &&
              categories.map((category) => (
                <BorderButton
                  key={category.id}
                  backgroundColor={"transparent"}
                  border={{ size: 2, color: "#ffae49" }}
                  onClick={() => handleSubmit(category)}
                >
                  {category.name}
                </BorderButton>
              ))}
          </div>
        </Modal.Body>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    TaskCategoryModal
  }
}
