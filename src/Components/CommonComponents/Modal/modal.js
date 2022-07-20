import { useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../Button/BorderButton";
import { CustomButton } from "../Button/Button";
import "./modal.css";

export function useSuccessModal() {
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();

  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const setSucessModalContent = (content) => setContent(content);

  const SuccessModal = () => {
    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        className={"default-mode"}
      >
        <Modal.Header closeButton>
        </Modal.Header>
        <Modal.Body>
          <div className="modal-body__content">
            <i className="modal-body__icon far fa-check-circle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>
            Close
          </BorderButton>
          <CustomButton onClick={handleClose}>Save Changes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    SuccessModal,
    setSucessModalContent,
  };
}
