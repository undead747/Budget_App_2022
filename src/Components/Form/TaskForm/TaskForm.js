import React from 'react';
import { ButtonGroup, Form } from 'react-bootstrap';
import { CustomButton } from '../../CommonComponents/Button/Button';
import './task-form.css';

function TaskForm(props) {
    return (
        <div className="task-form">
            <ButtonGroup className="task-form__button-group">
                <CustomButton>Income</CustomButton>
                <CustomButton>Expense</CustomButton>
            </ButtonGroup>

            <div className="task-form__form-content">
                <Form>
                    <Form.Group className="mb-3" controlId="formBasicEmail">
                        <Form.Label>Email address</Form.Label>
                        <Form.Control type="email" placeholder="Enter email" />
                        <Form.Text className="text-muted">
                            We'll never share your email with anyone else.
                        </Form.Text>
                    </Form.Group>

                    <Form.Group className="mb-3" controlId="formBasicPassword">
                        <Form.Label>Password</Form.Label>
                        <Form.Control type="password" placeholder="Password" />
                    </Form.Group>
                    <Form.Group className="mb-3" controlId="formBasicCheckbox">
                        <Form.Check type="checkbox" label="Check me out" />
                    </Form.Group>
                    <CustomButton type="submit">
                        Submit
                    </CustomButton>
                </Form>
            </div>
        </div>
    );
}

export default TaskForm;