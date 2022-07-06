import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';
import { CustomButton } from '../Button/Button';

function useModal() {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const modalComponent = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{content}</Modal.Body>
                    <Modal.Footer>
                        <CustomButton onClick={handleClose}>
                            Close
                        </CustomButton>
                        <CustomButton onClick={handleClose}>
                            Save Changes
                        </CustomButton>
                    </Modal.Footer>
                </Modal>
            </>
        );
    }

    return {
        handleClose,
        handleShow,
        setTitle,
        setContent,
        modalComponent    
    }

}

export default useModal;