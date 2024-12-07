"use client";
import React, { useEffect, useState } from "react";
import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import {
  Avatar,
  Image,
  Modal,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
} from "@nextui-org/react";
import axios from "axios";
// import LoadingSkeleton from "./LoadingSkeleton";
import styles from "@/app/ui/dashboard/users/users.module.css";
import { format } from "timeago.js";

const BhB = ({ equb }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null); // Track selected agent for action

  // Approve agent
  console.log(equb);

  // Delete agent
  const deleteAgent = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete(`/api/equb/${id}`);
      console.log(response);
      console.log(id);
    } catch (error) {
      console.error("Error deleting payment:", error);
    }
  };

  // Open modal for agent image

  // Handle delete action
  const handleDelete = (id) => {
    setSelectedAgentId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="">
      {/* Modal for approval/deletion confirmation */}
      <button
        onClick={() => handleDelete(equb._id)}
        className={`${styles.button} ${styles.delete}`}
      >
        Delete
      </button>
      <Modal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        aria-labelledby="modal-title"
        aria-describedby="modal-description"
      >
        <ModalContent>
          <ModalHeader>
            <h2
              className="text-xl font-bold text-black-900"
              style={{ color: "black" }}
            >
              Are you sure you want to delete this equb?
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-black-900" style={{ color: "black" }}>
              This payment was made {format(equb.createdAt)} and it is{" "}
              {equb.name}-{equb.type} with amount of {equb.amount} birr. Please
              note that all the associated payments will also be deleted. Do you
              really want to delete it?
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => {
                deleteAgent(selectedAgentId);
                setIsModalOpen(false);
              }}
              className="bg-red-500
               text-white px-4 py-2 rounded hover:bg-green-700"
            >
              Delete
            </button>
            <button
              onClick={() => setIsModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Cancel
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </div>
  );
};

export default BhB;
