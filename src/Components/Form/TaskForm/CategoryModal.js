import React, { useEffect, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../../CommonComponents/Button/BorderButton";
import { useHomeController } from "../../HomeContext";
import { taskModes } from "../../../Constants/TaskConstaints";

export function useAccountCategoryModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const AccountCategoryModal = ({ callback, ...rest }) => {
    const {accountCategories} = useHomeController();

    const handleSubmit = (category) => {
      handleClose();
      if(callback) callback(category);
    };

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
      handleShow,
      handleClose,
      AccountCategoryModal
  }
}


export function useTaskCategoryModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const TaskCategoryModal = ({ callback, selectedTaskMode, ...rest }) => {
    const {incomeCategories, expenseCategories} = useHomeController();
    const [categories, setCategories] = useState();

    const displayModalTitle = () => {
        if(selectedTaskMode.id === taskModes.Expense.id) return "Expense Categories";
        if(selectedTaskMode.id === taskModes.Income.id) return "Income Categories";
    }

    useEffect(() => {
        if(incomeCategories && expenseCategories){
          if(selectedTaskMode.id === taskModes.Expense.id){
            setCategories(expenseCategories);
            return
          } 

          if(selectedTaskMode.id === taskModes.Income.id){
            setCategories(incomeCategories);
            return
          }        
        }
    }, [incomeCategories, expenseCategories])

    const handleSubmit = (category) => {
      handleClose();
      if(callback) callback(category);
    };

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
      handleShow,
      handleClose,
      TaskCategoryModal
  }
}
