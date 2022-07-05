import React, { useEffect, useRef, useState } from 'react';
import { ButtonGroup, Form } from 'react-bootstrap';
import { getFormatDateForDatePicker } from '../../../Helpers/DateHelper';
import BorderButton from '../../CommonComponents/Button/BorderButton';
import { CustomButton } from '../../CommonComponents/Button/Button';
import GobackButton from '../../CommonComponents/Button/GobackButton';
import './task-form.css';

function TaskForm(props) {
    const taskModeList = [
        {
            id: 0,
            name: "Income"
        },
        {
            id: 1,
            name: "Expense"
        },
    ]

    const [selectedTaskMode, setSelectedTaskMode] = useState(taskModeList[0]);
    const titleRef = useRef(),
          dateRef = useRef(),
          accountCategoryRef = useRef(),
          taskCategoryRef = useRef(),
          amountRef = useRef(),
          noteRef = useRef();

    const handleSelectMode = (mode) => setSelectedTaskMode(mode);

    const handleSubmit = (event) => {
        
    }

    useEffect(() => {
        dateRef.current.value = getFormatDateForDatePicker();
    })

    return (
        <div className="task-form">
            <div className='task-form__header'>
                <GobackButton backgroundColor={"transparent"}>Go back</GobackButton>
                <h5 className="task-form__title">{selectedTaskMode.name}</h5>
            </div>

            <ButtonGroup className="task-form__button-group">
                {
                    taskModeList.map(mode => {
                        if(mode.id === selectedTaskMode.id) return <CustomButton callback={() => handleSelectMode(mode)} key={mode.id}>{mode.name}</CustomButton>
            
                        return <BorderButton border={{size: 2}} backgroundColor={"transparent"} callback={() => handleSelectMode(mode)} key={mode.id}>{mode.name}</BorderButton>
                    })
                }
            </ButtonGroup>

            <div className="task-form__form-content">
                <Form onSubmit={handleSubmit}>
                    <Form.Group className="mb-3" controlId="formDate">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" ref={dateRef} required  />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formAccountCategory">
                        <Form.Label>Account</Form.Label>
                        <Form.Control type="text" ref={accountCategoryRef} required />
                    </Form.Group>
                 
                    <Form.Group className="mb-3" controlId="formTaskCategory">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" ref={taskCategoryRef} required />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formAmount">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="number" ref={amountRef} required />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="formAccountTitle">
                        <Form.Label>Title</Form.Label>
                        <Form.Control type="text" ref={titleRef} />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formTitle">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" rows="3" name="address" ref={noteRef} />
                    </Form.Group>
                    <div className="d-grid gap-2">
                    <CustomButton type="submit">
                        Submit
                    </CustomButton>
                    </div>
                </Form>
            </div>
        </div>
    );
}

export default TaskForm;