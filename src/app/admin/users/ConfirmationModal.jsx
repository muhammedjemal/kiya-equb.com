// DeleteConfirmationModal.jsx
"use client"; // This makes it a Client Component
import React, { useState } from "react";
import { Modal, Button } from "@nextui-org/react";

const DeleteConfirmationModal = ({ agentName, onDelete }) => {
  const [isOpen, setIsOpen] = useState(false); // State to open/close the modal

  // Open modal
  const openModal = () => setIsOpen(true);

  // Close modal
  const closeModal = () => setIsOpen(false);

  // Confirm deletion and close modal
  const handleConfirmDelete = () => {
    onDelete(); // Call the delete action passed as prop
    closeModal(); // Close the modal
  };

  return (
    <div>
      <Button color="error" onClick={openModal}>
        Delete {agentName}
      </Button>

      <Modal open={isOpen} onClose={closeModal}>
        <Modal.Header>
          <h2>Confirm Deletion</h2>
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to delete the agent:{" "}
            <strong>{agentName}</strong>?
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button auto color="error" onClick={handleConfirmDelete}>
            Confirm
          </Button>
          <Button auto onClick={closeModal}>
            Cancel
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default DeleteConfirmationModal;
