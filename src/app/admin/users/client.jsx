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

const BhB = ({ user }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedAgentId, setSelectedAgentId] = useState(null); // Track selected agent for action

  // Approve agent
  console.log(user);

  // Delete agent
  const deleteAgent = async (id) => {
    try {
      console.log(id);
      const response = await axios.delete(`/api/user/${id}`);
      console.log(response);
      console.log(id);
    } catch (error) {
      console.error("Error deleting agent:", error);
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
        onClick={() => handleDelete(user._id)}
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
              Are you sure you want to delete this agent?
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-black-900" style={{ color: "black" }}>
              All the payments and admins associated with this agent will be
              deleted, and this action cannot be undone.
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
