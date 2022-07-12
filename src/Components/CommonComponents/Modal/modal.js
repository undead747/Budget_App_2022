import React, { useState } from 'react';
import { Modal } from 'react-bootstrap';

function useModal() {
    const [show, setShow] = useState(false);
    const [modalStates, setModalStates] = useState({
        size : "lg", 
        centered : true, 
        fullscreen : false, 
        content : '', 
        title : ''
    });
    const handleClose = () =>{
        // for prevent modal lagging when closing (causing by reset Modal state)
        const minimumDelay = 100;
        setShow(false);
        setTimeout(() => {
            setModalStates({
                size : "lg", 
                centered : true, 
                fullscreen : false, 
                content : '', 
                title : ''
            });
        }, minimumDelay);
    } 
    const handleShow = () => setShow(true);

    const setIModalStates = (props) => {
        const states = {size: "lg", centered: true, fullscreen: false, content : '', title : '', ...props};
        setModalStates(states);
    }

    const ModalComponent = () => {
        return (
            <>
                <Modal 
                        show={show} 
                        onHide={handleClose} 
                        centered={modalStates.centered} 
                        size={modalStates.size}
                        fullscreen={modalStates.fullscreen}
                        className={"default-mode"}>
                    <Modal.Header closeButton>
                        <Modal.Title>{modalStates.title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{modalStates.content}</Modal.Body>
                    <Modal.Footer>{modalStates.footer && modalStates.footer}</Modal.Footer>
                </Modal>
            </>
        );
    }

    return {
        handleClose,
        handleShow,
        setIModalStates,
        ModalComponent    
    }

}

export default useModal;