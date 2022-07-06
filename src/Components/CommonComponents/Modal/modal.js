import React from 'react';
import { Modal } from 'react-bootstrap';
import { CustomButton } from '../Button/Button';

function modal({title, content, ...rest}) {
    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);

    const modalComponent = () => {
        return (
            <>
                <Modal show={show} onHide={handleClose}>
                    <Modal.Header closeButton>
                        <Modal.Title>{title}</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>{cotent}</Modal.Body>
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
        modalComponent    
    }

}

export default modal;