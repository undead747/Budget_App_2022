import React, { useState } from "react";
import { taskModes } from "../../../Constants/TaskConstaints";
import BorderButton from "../../CommonComponents/Button/BorderButton";

export function useAccountCategoryModal() {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  AccountCategoryModal = ({ accountCategories, callback, ...rest }) => {
    handleSubmit = (category) => {
      handleClose();
      callback(category);
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

// export function TaskCategoryModal({
//   incomeCategories,
//   expenseCategories,
//   selectedTaskMode,
//   handleClose,
//   setIModalStates,
//   taskCategoryRef,
//   ...rest
// }) {
//   const handleSubmit = (taskCategory) => {
//     taskCategoryRef.current.value = taskCategory.name;
//     handleClose();
//   };

//   let title = null;
//   let categories = null;

//   if (selectedTaskMode.id === taskModes.Income.id) {
//     title = "Income category";
//     categories = incomeCategories;
//   }

//   if (selectedTaskMode.id === taskModes.Expense.id) {
//     title = "Expense category";
//     categories = expenseCategories;
//   }

//   let content = (
//     <div className="category-group">
//       {categories &&
//         categories.map((category) => (
//           <BorderButton
//             key={category.id}
//             backgroundColor={"transparent"}
//             border={{ size: 2, color: "#ffae49" }}
//             onClick={() => handleSubmit(category)}
//           >
//             {category.name}
//           </BorderButton>
//         ))}
//     </div>
//   );

//   setIModalStates({ content: content, title: title });
// }
