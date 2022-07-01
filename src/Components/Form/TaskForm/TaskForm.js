import React from 'react';
import { ButtonGroup, Form } from 'react-bootstrap';
import { CustomButton } from '../../CommonComponents/Button/Button';
import GobackButton from '../../CommonComponents/Button/GobackButton';
import './task-form.css';

function TaskForm(props) {
    return (
        <div className="task-form">
            <div className='task-form__header'>
                <GobackButton backgroundColor={"transparent"}>Go back</GobackButton>
                <h5 className="task-form__title">Income</h5>
            </div>

            <ButtonGroup className="task-form__button-group">
                <CustomButton>Income</CustomButton>
                <CustomButton backgroundColor={"transparent"} border={"2px var(--button-color-type-1) solid"}>Expense</CustomButton>
            </ButtonGroup>

            <div className="task-form__form-content">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Date</Form.Label>
                        <Form.Control type="date" />
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Account</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                 
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Category</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
                    
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Amount</Form.Label>
                        <Form.Control type="text" />
                    </Form.Group>
          
                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Note</Form.Label>
                        <Form.Control as="textarea" rows="3" name="address" />
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