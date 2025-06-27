import React from "react";
import { Modal, Button, Form } from "react-bootstrap";
import API from "../utils/utilRequest";

const AddImageModal = ({ show, handleClose }) => {
  const handleUploadClick = async (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = "image/png";

    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;

      try {
        const res = await API.GetStationImageById(id, file);
        alert(`Image uploaded for ID ${id} successfully!`);
      } catch (err) {
        console.error(err);
        alert(`Failed to upload image for ID ${id}.`);
      }
    };

    input.click(); // Opens file picker
  };

  return (
    <Modal show={show} onHide={handleClose} centered size="lg">
      <Modal.Header closeButton>
        <Modal.Title>Upload Station Images</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form.Group className="mb-3">
          <div className="d-flex flex-wrap gap-2">
            {Array.from({ length: 20 }, (_, i) => {
              const id = i + 1;
              return (
                <Button
                  key={id}
                  variant="light"
                  onClick={() => handleUploadClick(id)}
                  className="d-flex flex-column align-items-center justify-content-center"
                  style={{ width: "100px", height: "60px", fontSize: "0.85rem" }}
                >
                  Upload<br />ID {id}
                </Button>
              );
            })}
          </div>
        </Form.Group>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" onClick={handleClose}>
          Close
        </Button>
      </Modal.Footer>
    </Modal>
  );
};

export default AddImageModal;
