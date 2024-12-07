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
import LoadingSkeleton from "./LoadingSkeleton";

const AdminAgents = () => {
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState("");
  const [actionType, setActionType] = useState(""); // Track the action type (approve or delete)
  const [selectedAgentId, setSelectedAgentId] = useState(null); // Track selected agent for action
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const getData = async (userId) => {
    const res = await fetch(`/api/agents`, {
      // method: "DELETE",
      cache: "no-store",
    });

    if (!res.ok) {
      throw new Error("Something went wrong");
    }

    // Equivalent to Axios' response.data
    const data = await res.json();
    return data;
  };
  // Fetch agents from the API
  useEffect(() => {
    const fetchAgents = async () => {
      try {
        // const response = await axios.get("/api/agents");
        const response = await getData();
        console.log(response);
        setAgents(response);
      } catch (error) {
        console.error("Error fetching agents:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchAgents();
  }, []);

  // Approve agent
  const approveAgent = async (id) => {
    try {
      await axios.patch(`/api/agents/${id}`, { agentStatus: "active" });
      setAgents((prevAgents) =>
        prevAgents.map((agent) =>
          agent._id === id ? { ...agent, agentStatus: "active" } : agent
        )
      );
    } catch (error) {
      console.error("Error approving agent:", error);
    }
  };

  // Delete agent
  const deleteAgent = async (id) => {
    try {
      await axios.delete(`/api/agents/${id}`);
      setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id));
    } catch (error) {
      console.error("Error deleting agent:", error);
    }
  };

  // Open modal for agent image
  const openImageModal = (image) => {
    setSelectedImage(image);
    setIsImageModalOpen(true);
  };

  // Handle approve action
  const handleApprove = (id) => {
    setActionType("approve");
    setSelectedAgentId(id);
    setIsModalOpen(true);
  };

  // Handle delete action
  const handleDelete = (id) => {
    setActionType("delete");
    setSelectedAgentId(id);
    setIsModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-black-100 p-6">
      <h1 className="text-center text-2xl font-bold mb-8">Agents Management</h1>
      {loading ? (
        <LoadingSkeleton />
      ) : agents.length === 0 ? (
        <div className="text-center">
          <p>No agents found.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {agents.map((agent) => (
            <Card
              key={agent._id}
              shadow="md"
              radius="lg"
              isHoverable
              className="p-4"
            >
              <CardHeader>
                <div>
                  <h3 className="text-lg font-bold">{agent.equbName}</h3>
                  <p className="text-sm text-gray-500">
                    {agent.description || "No description."}
                  </p>
                </div>
              </CardHeader>
              <CardBody>
                {/* Admin Details */}
                {["dagna", "sebsabi", "tsehafi"].map((role) => (
                  <div key={role} className="mb-6 border-b pb-4">
                    <h4 className="text-md font-semibold capitalize">
                      {role} (Admin)
                    </h4>
                    <div className="flex items-center mb-4">
                      <Avatar
                        src={agent[role]?.avatar || ""}
                        alt={`${agent[role]?.firstName || "Admin"} Avatar`}
                        size="lg"
                        className="mr-4"
                        onClick={() => openImageModal(agent[role]?.avatar)} // Open image modal
                      />
                      <div>
                        <p>
                          <b>Name:</b>{" "}
                          {`${agent[role]?.firstName || "N/A"} ${
                            agent[role]?.fatherName || ""
                          } ${agent[role]?.motherName || ""}`}
                        </p>
                        <p>
                          <b>Phone:</b> {agent[role]?.phoneNumber || "N/A"}
                        </p>
                      </div>
                    </div>
                    <div className="flex gap-4">
                      <Image
                        src={agent[role]?.id_front || ""}
                        alt={`${role} ID Front`}
                        className="w-1/2 h-auto rounded-lg"
                        onClick={() => openImageModal(agent[role]?.id_front)} // Open image modal
                      />
                      <Image
                        src={agent[role]?.id_back || ""}
                        alt={`${role} ID Back`}
                        className="w-1/2 h-auto rounded-lg"
                        onClick={() => openImageModal(agent[role]?.id_back)} // Open image modal
                      />
                    </div>
                  </div>
                ))}

                {/* Bank Information */}
                <div className="mt-4">
                  <h4 className="text-md font-semibold">Bank Information</h4>
                  <ul className="list-disc ml-6">
                    {agent.banks.length > 0 ? (
                      agent.banks.map((bank, index) => (
                        <li key={index} className="mb-2">
                          <p>
                            <b>Bank Name:</b> {bank.bankName}
                          </p>
                          <p>
                            <b>Account Number:</b> {bank.accountNumber}
                          </p>
                        </li>
                      ))
                    ) : (
                      <p>No bank information available.</p>
                    )}
                  </ul>
                </div>

                {/* Other Details */}
                <div className="mt-4">
                  <p>
                    <b>Status:</b>{" "}
                    <span
                      className={`${
                        agent.agentStatus === "active"
                          ? "text-green-500"
                          : "text-red-500"
                      }`}
                    >
                      {agent.agentStatus}
                    </span>
                  </p>
                  <p>
                    <b>Equb Amount:</b> {agent.equbAmount || "N/A"}
                  </p>
                  <p>
                    <b>Equb Type:</b> {agent.equbType || "N/A"}
                  </p>
                </div>
              </CardBody>
              <CardFooter className="flex justify-between">
                <button
                  onClick={() => handleApprove(agent._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                  disabled={agent.agentStatus === "active"}
                >
                  {agent.agentStatus === "active" ? "Approved" : "Approve"}
                </button>
                <button
                  onClick={() => handleDelete(agent._id)}
                  className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
                >
                  Delete
                </button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      <Modal
        isOpen={isImageModalOpen}
        onClose={() => setIsImageModalOpen(false)}
        aria-labelledby="image-modal-title"
        aria-describedby="image-modal-description"
      >
        <ModalContent>
          <ModalHeader>
            <h2 className="text-xl font-bold text-black-900">View Image</h2>
          </ModalHeader>
          <ModalBody>
            <Image
              src={selectedImage}
              alt="Selected Image"
              className="w-full h-auto rounded-lg"
            />
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => setIsImageModalOpen(false)}
              className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
            >
              Close
            </button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Modal for approval/deletion confirmation */}
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
              {actionType === "approve"
                ? "Are you sure you want to approve this agent?"
                : "Are you sure you want to delete this agent?"}
            </h2>
          </ModalHeader>
          <ModalBody>
            <p className="text-black-900" style={{ color: "black" }}>
              {actionType === "approve" ? (
                <>
                  The admins of this agent (
                  {`${
                    agents.find((a) => a._id === selectedAgentId).dagna
                      .firstName
                  } ${
                    agents.find((a) => a._id === selectedAgentId).dagna
                      .fatherName
                  }`}
                  {", "}
                  {`${
                    agents.find((a) => a._id === selectedAgentId).tsehafi
                      .firstName
                  } ${
                    agents.find((a) => a._id === selectedAgentId).tsehafi
                      .fatherName
                  }`}{" "}
                  {" and "}
                  {`${
                    agents.find((a) => a._id === selectedAgentId).sebsabi
                      .firstName
                  } ${
                    agents.find((a) => a._id === selectedAgentId).sebsabi
                      .fatherName
                  }`}
                  ) will be created as well. They will have an initial password
                  123 and will need to change it later. You can delete them
                  whenever you want.
                </>
              ) : (
                "All the payments and admins associated with this agent will be deleted, and this action cannot be undone."
              )}
            </p>
          </ModalBody>
          <ModalFooter>
            <button
              onClick={() => {
                if (actionType === "approve") approveAgent(selectedAgentId);
                if (actionType === "delete") deleteAgent(selectedAgentId);
                setIsModalOpen(false);
              }}
              className={` ${
                actionType === "approve" ? "bg-green-500" : "bg-red-500"
              } text-white px-4 py-2 rounded hover:bg-green-700`}
            >
              {actionType === "approve" ? "Approve" : "Delete"}
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

export default AdminAgents;
