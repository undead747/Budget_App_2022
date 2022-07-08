import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

function useModal() {
    const [show, setShow] = useState(false);
    const [title, setTitle] = useState();
    const [content, setContent] = useState();

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const modalComponent = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose} centered={true} size={"lg"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{content}</Modal.Body>
                </Modal>
            </>
        );
    }

    return {
        show,
        handleClose,
        handleShow,
        setTitle,
        setContent,
        modalComponent    
    }

}

export default useModal;