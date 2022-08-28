import { useRef, useState } from "react";
import { Modal } from "react-bootstrap";
import BorderButton from "../Button/BorderButton";
import { CustomButton } from "../Button/Button";
import "./modal.css";

/**
 * Custom React-Bootstrap modal component. Use when display success messages modal.  
 * Returns open, close, set message content Func and modal component.
 */
export function useSuccessModal() {
  // #region State 
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  // #endregion State


  // #region Function
  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const setSucessModalContent = (content) => setContent(content);
  // #endregion Function

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
          <CustomButton onClick={handleClose}>Close</CustomButton>
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

/**
 * Custom React-Bootstrap modal component. Use when display error messages modal.  
 * Returns open, close, set message content Func and modal component.
 */
export function useErrorModal() {
  // #region State 
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  // #endregion State 

  // #region Function 
  const handleShow = () => setShow(true);

  const handleClose = () => setShow(false);

  const setErrorModalContent = (content) => setContent(content);
  // #endregion Function 

  const ErrorModal = () => {
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
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <CustomButton onClick={handleClose}>CLose</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ErrorModal,
    setErrorModalContent,
  };
}

/**
 * Custom React-Bootstrap modal component. Use when display confirm messages modal.  
 * Returns open, close, set message content Func and modal component.
 */
export function useConfirmModal() {
  // #region State 
  const [show, setShow] = useState(false);
  const [content, setContent] = useState();
  const [callback, setCallback] = useState();
  // #endregion State 

  // #region Func 
  const handleShow = (callback) => {
    setShow(true);
    setCallback(() => callback);
  }

  const handleClose = () => setShow(false);

  const submit = () => {
    if (callback) callback();
    handleClose();
  }

  const setConfirmModalContent = (content) => setContent(content);
  // #endregion Func

  const ConfirmModal = () => {
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
            <i className="modal-body__icon fas fa-exclamation-triangle"></i>
            <p className="modal-body__p">{content && content}</p>
          </div>
        </Modal.Body>
        <Modal.Footer>
          <BorderButton border={{ size: 2 }} onClick={handleClose}>Cancel</BorderButton>
          <CustomButton onClick={submit}>Yes</CustomButton>
        </Modal.Footer>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    handleClose,
    ConfirmModal,
    setConfirmModalContent,
  };
}

