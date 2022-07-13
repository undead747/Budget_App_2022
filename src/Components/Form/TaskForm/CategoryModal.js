import React from 'react';
import { taskModes } from '../../../Constants/TaskConstaints';
import BorderButton from '../../CommonComponents/Button/BorderButton';

export function AccountCategoryModal({accountCategories, handleClose, setIModalStates, accountCategoryRef, ...rest }) {
    const handleSubmit = (category) => {
        accountCategoryRef.current.value = category.name;
        handleClose();
    }

    let content = (
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
      );
  
      setIModalStates({content: content, title: "Account category"});
}


export function TaskCategoryModal({selectedTaskMode, incomeCategories, expenseCategories, handleClose, setIModalStates, taskCategoryRef, ...rest}){
    const handleSubmit = (taskCategory) => {
        taskCategoryRef.current.value = taskCategory.name;
        handleClose();
    }
    
    let title = null;
    let categories = null;

    if (selectedTaskMode.id === taskModes.Income.id) {
      title = "Income category";
      categories = incomeCategories;
    }

    if (selectedTaskMode.id === taskModes.Expense.id) {
      title = "Expense category";
      categories = expenseCategories;
    }

    let content = (
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
    );

    setIModalStates({ content: content, title: title });
}