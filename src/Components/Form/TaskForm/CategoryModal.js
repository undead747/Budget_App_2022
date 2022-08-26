import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { useHomeController } from "../../HomeContext";
import { taskModes } from "../../../Constants/TaskConstaints";
import useCreateCategoryModal from "./CreateCategoryModal";
import { DatabaseCollections } from "../../../Database/useFirestore";

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
    const {show: addCategoryStatus, handleShow: showAddCategory, handleClose: closeAddCategory, CreateCategoryModal} = useCreateCategoryModal();
    // #endregion State 

    // #region Function
    const handleSubmit = (category) => {
      handleClose();
      if (callback) callback(category);
    };

    // #endregion Function 

    return (
      <>
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
                    <span><i class="fas fa-times"></i></span>
                  </BorderButton>
                ))}
                <BorderButton customClass={"add-category"}  backgroundColor={"transparent"}
                    border={{ size: 2, color: "#ffae49" }} onClick={showAddCategory}>
                      <i className="fas fa-plus"></i>
                </BorderButton>
            </div>
          </Modal.Body>
        </Modal>

        {addCategoryStatus && <CreateCategoryModal collectionName={DatabaseCollections.AccountCategory} />}
      </>
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
    const {show: addCategoryStatus, handleShow: showAddCategory, handleClose: closeAddCategory, CreateCategoryModal} = useCreateCategoryModal();
    let taskCategoryCollectionName = null;
    if (selectedTaskMode.id === taskModes.Expense.id) taskCategoryCollectionName = DatabaseCollections.ExpenseCategory;
    if (selectedTaskMode.id === taskModes.Income.id) taskCategoryCollectionName = DatabaseCollections.IncomeCategory;

    // #endregion State 

    // #region Function 
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
          <Modal.Title>{taskCategoryCollectionName}</Modal.Title>
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
               <BorderButton customClass={"add-category"}  backgroundColor={"transparent"}
                    border={{ size: 2, color: "#ffae49" }} onClick={showAddCategory}>
                      <i className="fas fa-plus"></i>
                </BorderButton>
          </div>
          {addCategoryStatus && <CreateCategoryModal collectionName={taskCategoryCollectionName} />}
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
