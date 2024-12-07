"use client";

import React, { useState } from "react";
import {
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";

const ConfirmationModal = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  description,
  confirmLabel = "Confirm",
  cancelLabel = "Cancel",
  confirmVariant = "primary",
  cancelVariant = "default",
}) => {
  const variantStyles = {
    primary: "bg-blue-500 text-white hover:bg-blue-700",
    danger: "bg-red-500 text-white hover:bg-red-700",
    success: "bg-green-500 text-white hover:bg-green-700",
    warning: "bg-yellow-500 text-white hover:bg-yellow-700",
    default: "bg-gray-500 text-white hover:bg-gray-700",
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      aria-labelledby="modal-title"
      aria-describedby="modal-description"
    >
      <ModalContent>
        <ModalHeader>
          <h2 className="text-xl font-bold text-black">{title}</h2>
        </ModalHeader>
        <ModalBody>
          <p className="text-black">{description}</p>
        </ModalBody>
        <ModalFooter className="flex gap-2">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded ${variantStyles[cancelVariant]}`}
          >
            {cancelLabel}
          </button>
          <button
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className={`px-4 py-2 rounded ${variantStyles[confirmVariant]}`}
          >
            {confirmLabel}
          </button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

export default ConfirmationModal;

// usage

// import React, { useState } from "react";
// import ConfirmationModal from "./ConfirmationModal";

// const ExampleActions = () => {
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [actionType, setActionType] = useState("");

//   const handleAction = (type) => {
//     setActionType(type);
//     setIsModalOpen(true);
//   };

//   const performAction = () => {
//     if (actionType === "approve") {
//       console.log("Approving...");
//     } else if (actionType === "delete") {
//       console.log("Deleting...");
//     }
//   };

//   return (
//     <div className="p-6">
//       <h1 className="text-2xl font-bold mb-4">Example Actions</h1>
//       <div className="flex gap-4">
//         <button
//           onClick={() => handleAction("approve")}
//           className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//         >
//           Approve
//         </button>
//         <button
//           onClick={() => handleAction("delete")}
//           className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
//         >
//           Delete
//         </button>
//       </div>
//       <ConfirmationModal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         onConfirm={performAction}
//         title={`Are you sure you want to ${actionType}?`}
//         description={
//           actionType === "approve"
//             ? "This will approve the selected item. You can undo this later."
//             : "This will delete the selected item permanently. This action cannot be undone."
//         }
//         confirmLabel={actionType === "approve" ? "Approve" : "Delete"}
//         confirmVariant={actionType === "approve" ? "success" : "danger"}
//       />
//     </div>
//   );
// };

// export default ExampleActions;
