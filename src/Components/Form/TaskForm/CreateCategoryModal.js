import React, { useRef, useState } from "react";
import { Form, Modal } from "react-bootstrap";
import { useFirestore } from "../../../Database/useFirestore";
import { CustomButton } from "../../CommonComponents/Button/Button";
import { useHomeController } from "../../HomeContext";

export default function useCreateCategoryModal() {
  // #region State
  const [show, setShow] = useState(false);
  // #endregion State
  const handleShow = () => setShow(true);
  
  const CreateCategoryModal = ({ collectionName , callback, ...rest }) => {
    // Get loading animantion, alert message from home-Controller.
    const { setLoading } = useHomeController();
    const nameRef = useRef();
    
    // Database method
    const { addDocument } = useFirestore(collectionName);

    const handleClose = () => {
        setShow(false);
    }

    const handleSubmit = async (e) => {
      e.preventDefault();

      try {
        setLoading(true);
        let result = await addDocument({Name: nameRef.current.value});
        setLoading(false);
        setTimeout(() => {
            handleClose();
        }, 100)
      } catch (error) {}
    };

    return (
      <Modal
        show={show}
        onHide={handleClose}
        centered={true}
        size={"lg"}
        className={"default-mode"}
      >
        <Modal.Header closeButton>
          <Modal.Title>{collectionName}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
            <Form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label htmlFor="amount" className="form-label">
                  Category Name
                </label>
                  <input
                    className="form-control"
                    type="text"
                    ref={nameRef}
                    required
                  ></input>
              </div>
              <div className="d-grid gap-2">
                <CustomButton type="submit">Add</CustomButton>
              </div>
            </Form>
        </Modal.Body>
      </Modal>
    );
  };

  return {
    show,
    handleShow,
    CreateCategoryModal,
  };
}
