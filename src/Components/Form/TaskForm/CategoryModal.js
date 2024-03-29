import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { useHomeController } from "../../HomeContext";
import { taskModes } from "../../../Constants/TaskConstaints";
import useCreateCategoryModal from "./CreateCategoryModal";
import {
  DatabaseCollections,
  useFirestore,
} from "../../../Database/useFirestore";

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
    const { setLoading, accountCategories } = useHomeController();
    const {
      show: addCategoryStatus,
      handleShow: showAddCateModal,
      CreateCategoryModal,
    } = useCreateCategoryModal();
    // Database method
    const { deleteDocument } = useFirestore(
      DatabaseCollections.AccountCategory
    );
    // #endregion State

    // #region Function
    const handleSubmit = (category) => {
      handleClose();
      if (callback) callback(category);
    };

    const handleShowAddCateModal = () => {
      showAddCateModal();
    };

    const handleDeleteCate = async (event, docId) => {
      event.stopPropagation();
      try {
        await deleteDocument(docId);
      } catch (error) {}
    };

    // #endregion Function

    return (
      <>
        {!addCategoryStatus && (
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
                      customClass={"category-group__item"}
                      key={category.id}
                      backgroundColor={"transparent"}
                      border={{ size: 2, color: "#ffae49" }}
                      onClick={() => handleSubmit(category)}
                    >
                      {category.name}
                      <span
                        className="category-group__times"
                        onClick={(event) =>
                          handleDeleteCate(event, category.id)
                        }
                      >
                        <i className="fas fa-times"></i>
                      </span>
                    </BorderButton>
                  ))}
                <BorderButton
                  customClass={"add-category"}
                  backgroundColor={"transparent"}
                  border={{ size: 2, color: "#ffae49" }}
                  onClick={handleShowAddCateModal}
                >
                  <i className="fas fa-plus"></i>
                </BorderButton>
              </div>
            </Modal.Body>
          </Modal>
        )}

        {addCategoryStatus && (
          <CreateCategoryModal
            callback={handleShow}
            collectionName={DatabaseCollections.AccountCategory}
          />
        )}
      </>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    AccountCategoryModal,
  };
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
    const {
      incomeCategories,
      expenseCategories,
      handleErrorShow,
      setErrorModalContent,
    } = useHomeController();
    const [categories, setCategories] = useState();
    const {
      show: addCategoryStatus,
      handleShow: showAddCategory,
      handleClose: closeAddCategory,
      CreateCategoryModal,
    } = useCreateCategoryModal();
    let taskCategoryCollectionName = null;
    if (selectedTaskMode.id === taskModes.Expense.id)
      taskCategoryCollectionName = DatabaseCollections.ExpenseCategory;
    if (selectedTaskMode.id === taskModes.Income.id)
      taskCategoryCollectionName = DatabaseCollections.IncomeCategory;
    const { deleteDocument } = useFirestore(taskCategoryCollectionName);
    // #endregion State

    // #region Function
    useEffect(() => {
      if (incomeCategories && expenseCategories) {
        if (selectedTaskMode.id === taskModes.Expense.id) {
          setCategories(expenseCategories);
          return;
        }

        if (selectedTaskMode.id === taskModes.Income.id) {
          setCategories(incomeCategories);
          return;
        }
      }
    }, [incomeCategories, expenseCategories]);

    const handleSubmit = (category) => {
      handleClose();
      if (callback) callback(category);
    };

    const handleDeleteCate = async (event, docId) => {
      event.stopPropagation();
      try {
        await deleteDocument(docId);
      } catch (error) {
        setErrorModalContent(error.message);
        handleErrorShow();
      }
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
            <Modal.Title>{taskCategoryCollectionName}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="category-group">
              {categories &&
                categories.map((category) => (
                  <BorderButton
                    customClass={"category-group__item"}
                    key={category.id}
                    backgroundColor={"transparent"}
                    border={{ size: 2, color: "#ffae49" }}
                    onClick={() => handleSubmit(category)}
                  >
                    {category.name}
                    <span
                      className="category-group__times"
                      onClick={(event) => handleDeleteCate(event, category.id)}
                    >
                      <i className="fas fa-times"></i>
                    </span>
                  </BorderButton>
                ))}
              <BorderButton
                customClass={"add-category"}
                backgroundColor={"transparent"}
                border={{ size: 2, color: "#ffae49" }}
                onClick={showAddCategory}
              >
                <i className="fas fa-plus"></i>
              </BorderButton>
            </div>
          </Modal.Body>
        </Modal>
        {addCategoryStatus && (
          <CreateCategoryModal collectionName={taskCategoryCollectionName} />
        )}
      </>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    TaskCategoryModal,
  };
}
