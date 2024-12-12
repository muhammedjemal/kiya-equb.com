// "use client";
// import React, { useEffect, useState } from "react";
// import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
// import {
//   Avatar,
//   Image,
//   Modal,
//   ModalContent,
//   ModalHeader,
//   ModalBody,
//   ModalFooter,
// } from "@nextui-org/react";
// import axios from "axios";
// import LoadingSkeleton from "./LoadingSkeleton";

// const AdminAgents = () => {
//   const [agents, setAgents] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [isModalOpen, setIsModalOpen] = useState(false);
//   const [selectedImage, setSelectedImage] = useState("");
//   const [actionType, setActionType] = useState(""); // Track the action type (approve or delete)
//   const [selectedAgentId, setSelectedAgentId] = useState(null); // Track selected agent for action
//   const [isImageModalOpen, setIsImageModalOpen] = useState(false);
//   const getData = async (userId) => {
//     const res = await fetch(`/api/agents`, {
//       // method: "DELETE",
//       // cache: "no-store",
//     });

//     if (!res.ok) {
//       throw new Error("Something went wrong");
//     }

//     // Equivalent to Axios' response.data
//     const data = await res.json();
//     return data;
//   };
//   // Fetch agents from the API
//   useEffect(() => {
//     const fetchAgents = async () => {
//       try {
//         // const response = await axios.get("/api/agents");
//         const response = await getData();
//         console.log(response);
//         setAgents(response);
//       } catch (error) {
//         console.error("Error fetching agents:", error);
//       } finally {
//         setLoading(false);
//       }
//     };

//     fetchAgents();
//   }, []);

//   // Approve agent
//   const approveAgent = async (id) => {
//     try {
//       await axios.patch(`/api/agents/${id}`, { agentStatus: "active" });
//       setAgents((prevAgents) =>
//         prevAgents.map((agent) =>
//           agent._id === id ? { ...agent, agentStatus: "active" } : agent
//         )
//       );
//     } catch (error) {
//       console.error("Error approving agent:", error);
//     }
//   };

//   // Delete agent
//   const deleteAgent = async (id) => {
//     try {
//       await axios.delete(`/api/agents/${id}`);
//       setAgents((prevAgents) => prevAgents.filter((agent) => agent._id !== id));
//     } catch (error) {
//       console.error("Error deleting agent:", error);
//     }
//   };

//   // Open modal for agent image
//   const openImageModal = (image) => {
//     setSelectedImage(image);
//     setIsImageModalOpen(true);
//   };

//   // Handle approve action
//   const handleApprove = (id) => {
//     setActionType("approve");
//     setSelectedAgentId(id);
//     setIsModalOpen(true);
//   };

//   // Handle delete action
//   const handleDelete = (id) => {
//     setActionType("delete");
//     setSelectedAgentId(id);
//     setIsModalOpen(true);
//   };

//   return (
//     <div className="min-h-screen bg-black-100 p-6">
//       <h1 className="text-center text-2xl font-bold mb-8">Agents Management</h1>
//       {loading ? (
//         <LoadingSkeleton />
//       ) : agents.length === 0 ? (
//         <div className="text-center">
//           <p>No agents found.</p>
//         </div>
//       ) : (
//         <div className="space-y-6">
//           {agents.map((agent) => (
//             <Card
//               key={agent._id}
//               shadow="md"
//               radius="lg"
//               isHoverable
//               className="p-4"
//             >
//               <CardHeader>
//                 <div>
//                   <h3 className="text-lg font-bold">{agent.equbName}</h3>
//                   <p className="text-sm text-gray-500">
//                     {agent.description || "No description."}
//                   </p>
//                 </div>
//               </CardHeader>
//               <CardBody>
//                 {/* Admin Details */}
//                 {["dagna", "sebsabi", "tsehafi"].map((role) => (
//                   <div key={role} className="mb-6 border-b pb-4">
//                     <h4 className="text-md font-semibold capitalize">
//                       {role} (Admin)
//                     </h4>
//                     <div className="flex items-center mb-4">
//                       <Avatar
//                         src={agent[role]?.avatar || ""}
//                         alt={`${agent[role]?.firstName || "Admin"} Avatar`}
//                         size="lg"
//                         className="mr-4"
//                         onClick={() => openImageModal(agent[role]?.avatar)} // Open image modal
//                       />
//                       <div>
//                         <p>
//                           <b>Name:</b>{" "}
//                           {`${agent[role]?.firstName || "N/A"} ${
//                             agent[role]?.fatherName || ""
//                           } ${agent[role]?.motherName || ""}`}
//                         </p>
//                         <p>
//                           <b>Phone:</b> {agent[role]?.phoneNumber || "N/A"}
//                         </p>
//                       </div>
//                     </div>
//                     <div className="flex gap-4">
//                       <Image
//                         src={agent[role]?.id_front || ""}
//                         alt={`${role} ID Front`}
//                         className="w-1/2 h-auto rounded-lg"
//                         onClick={() => openImageModal(agent[role]?.id_front)} // Open image modal
//                       />
//                       <Image
//                         src={agent[role]?.id_back || ""}
//                         alt={`${role} ID Back`}
//                         className="w-1/2 h-auto rounded-lg"
//                         onClick={() => openImageModal(agent[role]?.id_back)} // Open image modal
//                       />
//                     </div>
//                   </div>
//                 ))}

//                 {/* Bank Information */}
//                 <div className="mt-4">
//                   <h4 className="text-md font-semibold">Bank Information</h4>
//                   <ul className="list-disc ml-6">
//                     {agent.banks.length > 0 ? (
//                       agent.banks.map((bank, index) => (
//                         <li key={index} className="mb-2">
//                           <p>
//                             <b>Bank Name:</b> {bank.bankName}
//                           </p>
//                           <p>
//                             <b>Account Number:</b> {bank.accountNumber}
//                           </p>
//                         </li>
//                       ))
//                     ) : (
//                       <p>No bank information available.</p>
//                     )}
//                   </ul>
//                 </div>

//                 {/* Other Details */}
//                 <div className="mt-4">
//                   <p>
//                     <b>Status:</b>{" "}
//                     <span
//                       className={`${
//                         agent.agentStatus === "active"
//                           ? "text-green-500"
//                           : "text-red-500"
//                       }`}
//                     >
//                       {agent.agentStatus}
//                     </span>
//                   </p>
//                   <p>
//                     <b>Equb Amount:</b> {agent.equbAmount || "N/A"}
//                   </p>
//                   <p>
//                     <b>Equb Type:</b> {agent.equbType || "N/A"}
//                   </p>
//                 </div>
//               </CardBody>
//               <CardFooter className="flex justify-between">
//                 <button
//                   onClick={() => handleApprove(agent._id)}
//                   className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
//                   disabled={agent.agentStatus === "active"}
//                 >
//                   {agent.agentStatus === "active" ? "Approved" : "Approve"}
//                 </button>
//                 <button
//                   onClick={() => handleDelete(agent._id)}
//                   className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
//                 >
//                   Delete
//                 </button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//       <Modal
//         isOpen={isImageModalOpen}
//         onClose={() => setIsImageModalOpen(false)}
//         aria-labelledby="image-modal-title"
//         aria-describedby="image-modal-description"
//       >
//         <ModalContent>
//           <ModalHeader>
//             <h2 className="text-xl font-bold text-black-900">View Image</h2>
//           </ModalHeader>
//           <ModalBody>
//             <Image
//               src={selectedImage}
//               alt="Selected Image"
//               className="w-full h-auto rounded-lg"
//             />
//           </ModalBody>
//           <ModalFooter>
//             <button
//               onClick={() => setIsImageModalOpen(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
//             >
//               Close
//             </button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>

//       {/* Modal for approval/deletion confirmation */}
//       <Modal
//         isOpen={isModalOpen}
//         onClose={() => setIsModalOpen(false)}
//         aria-labelledby="modal-title"
//         aria-describedby="modal-description"
//       >
//         <ModalContent>
//           <ModalHeader>
//             <h2
//               className="text-xl font-bold text-black-900"
//               style={{ color: "black" }}
//             >
//               {actionType === "approve"
//                 ? "Are you sure you want to approve this agent?"
//                 : "Are you sure you want to delete this agent?"}
//             </h2>
//           </ModalHeader>
//           <ModalBody>
//             <p className="text-black-900" style={{ color: "black" }}>
//               {actionType === "approve" ? (
//                 <>
//                   The admins of this agent (
//                   {`${
//                     agents.find((a) => a._id === selectedAgentId).dagna
//                       .firstName
//                   } ${
//                     agents.find((a) => a._id === selectedAgentId).dagna
//                       .fatherName
//                   }`}
//                   {", "}
//                   {`${
//                     agents.find((a) => a._id === selectedAgentId).tsehafi
//                       .firstName
//                   } ${
//                     agents.find((a) => a._id === selectedAgentId).tsehafi
//                       .fatherName
//                   }`}{" "}
//                   {" and "}
//                   {`${
//                     agents.find((a) => a._id === selectedAgentId).sebsabi
//                       .firstName
//                   } ${
//                     agents.find((a) => a._id === selectedAgentId).sebsabi
//                       .fatherName
//                   }`}
//                   ) will be created as well. They will have an initial password
//                   123 and will need to change it later. You can delete them
//                   whenever you want.
//                 </>
//               ) : (
//                 "All the payments and admins associated with this agent will be deleted, and this action cannot be undone."
//               )}
//             </p>
//           </ModalBody>
//           <ModalFooter>
//             <button
//               onClick={() => {
//                 if (actionType === "approve") approveAgent(selectedAgentId);
//                 if (actionType === "delete") deleteAgent(selectedAgentId);
//                 setIsModalOpen(false);
//               }}
//               className={` ${
//                 actionType === "approve" ? "bg-green-500" : "bg-red-500"
//               } text-white px-4 py-2 rounded hover:bg-green-700`}
//             >
//               {actionType === "approve" ? "Approve" : "Delete"}
//             </button>
//             <button
//               onClick={() => setIsModalOpen(false)}
//               className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700"
//             >
//               Cancel
//             </button>
//           </ModalFooter>
//         </ModalContent>
//       </Modal>
//     </div>
//   );
// };

// export default AdminAgents;

import { Card, CardHeader, CardBody, CardFooter } from "@nextui-org/card";
import { Avatar, Image } from "@nextui-org/react";
import { Agent, User, Payment } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import mongoose from "mongoose";
import { revalidatePath } from "next/cache";
import bcryptjs from "bcryptjs";
import { redirect } from "next/navigation";

function validatePhoneNumber(phoneNumber) {
  if (typeof phoneNumber !== "string") {
    throw new Error("Phone number must be a string.");
  }

  phoneNumber = phoneNumber.replace(/\s/g, "");

  if (phoneNumber.startsWith("+")) {
    phoneNumber = phoneNumber.slice(1);
  }

  if (phoneNumber.startsWith("251")) {
    phoneNumber = phoneNumber.slice(3);
  } else if (phoneNumber.startsWith("0")) {
    phoneNumber = phoneNumber.slice(1);
  } else {
    throw new Error("Invalid phone number format.");
  }

  if (!/^\d+$/.test(phoneNumber)) {
    throw new Error("Invalid phone number format.");
  }

  phoneNumber = Number(phoneNumber).toString();

  if (
    !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
    !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
  ) {
    throw new Error("Invalid phone number format.");
  }

  return "+251" + phoneNumber;
}

const approveAgent = async (id) => {
  const hashedPassword = await bcryptjs.hash("123", 10);
  const session = await mongoose.startSession();
  session.startTransaction(); // Start the transaction

  try {
    await connectToDb();

    const agent = await Agent.findById(id).session(session);

    if (!agent) {
      throw new Error("Agent not found");
    }

    if (!agent.dagna || !agent.tsehafi || !agent.sebsabi) {
      throw new Error("Agent is missing dagna, tsehafi, or sebsabi details");
    }

    let dagnaPhoneNumber, tsehafiPhoneNumber, sebsabiPhoneNumber;

    try {
      dagnaPhoneNumber = validatePhoneNumber(agent.dagna.phoneNumber);
      tsehafiPhoneNumber = validatePhoneNumber(agent.tsehafi.phoneNumber);
      sebsabiPhoneNumber = validatePhoneNumber(agent.sebsabi.phoneNumber);
    } catch (error) {
      throw new Error("Phone number validation failed: " + error.message);
    }

    try {
      await Agent.findByIdAndUpdate(id, { agentStatus: "active" }).session(
        session
      );
      const dagna = new User({
        firstName: agent.dagna.firstName,
        lastName: agent.dagna.fatherName,
        motherName: agent.dagna.motherName,
        phoneNumber: dagnaPhoneNumber,
        img: agent.dagna.avatar,
        idFront: agent.dagna.id_front,
        idBack: agent.dagna.id_back,
        password: hashedPassword,
        role: "dagna",
        agentId: id,
        isSystemAdmin: true,
      });

      const tsehafi = new User({
        firstName: agent.tsehafi.firstName,
        lastName: agent.tsehafi.fatherName,
        motherName: agent.tsehafi.motherName,
        phoneNumber: tsehafiPhoneNumber,
        img: agent.tsehafi.avatar,
        idFront: agent.tsehafi.id_front,
        idBack: agent.tsehafi.id_back,
        password: hashedPassword,
        role: "tsehafi",
        agentId: id,
        isSystemAdmin: true,
      });

      const sebsabi = new User({
        firstName: agent.sebsabi.firstName,
        lastName: agent.sebsabi.fatherName,
        motherName: agent.sebsabi.motherName,
        phoneNumber: sebsabiPhoneNumber,
        img: agent.sebsabi.avatar,
        idFront: agent.sebsabi.id_front,
        idBack: agent.sebsabi.id_back,
        password: hashedPassword,
        role: "sebsabi",
        agentId: id,
        isSystemAdmin: true,
      });

      await dagna.save({ session });
      await tsehafi.save({ session });
      await sebsabi.save({ session });
      await session.commitTransaction();

      revalidatePath("/admin/agents");
    } catch (error) {
      console.error("Error during transaction:", error);
      await session.abortTransaction(); // Abort the transaction if any error occurs

      throw new Error("Transaction failed: " + error.message);
    }
  } catch (error) {
    console.error("Error:", error);
    throw new Error("Update failed: " + error.message);
  } finally {
    session.endSession(); // End the session to clean up
  }
};

const deleteAgent = async (id) => {
  try {
    await connectToDb();

    await User.deleteMany({ agentId: id });
    await Agent.findByIdAndDelete(id);
    await Payment.deleteMany({ agentId: id });

    revalidatePath("/admin/agents");
  } catch (error) {
    console.error(error);
    throw new Error("Deletion failed.");
  }
};

const AdminAgentsPage = async ({ searchParams }) => {
  let agents = [];
  let loading = true;
  let selectedImage = searchParams?.image || "";
  try {
    await connectToDb();
    agents = await Agent.find();
    loading = false;
  } catch (error) {
    console.error("Error fetching agents:", error);
    loading = false;
  }
  const handleApprove = async (id) => {
    "use server";
    try {
      await approveAgent(id);
      redirect("/admin/agents");
    } catch (error) {
      console.log(error);
    }
  };
  const handleDelete = async (id) => {
    "use server";
    try {
      await deleteAgent(id);
      redirect("/admin/agents");
    } catch (error) {
      console.log(error);
    }
  };
  const handleImageModalClose = () => {
    const params = new URLSearchParams(searchParams);
    params.delete("image");
    redirect(`/admin/agents?${params.toString()}`);
  };
  return (
    <div className="min-h-screen bg-black-100 p-6">
      <h1 className="text-center text-2xl font-bold mb-8">Agents Management</h1>
      {loading ? (
        <div>Loading</div>
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
                      <a href={`/admin/agents?image=${agent[role]?.id_front}`}>
                        <Image
                          src={agent[role]?.id_front || ""}
                          alt={`${role} ID Front`}
                          className="w-1/2 h-auto rounded-lg"
                        />
                      </a>

                      <a href={`/admin/agents?image=${agent[role]?.id_back}`}>
                        <Image
                          src={agent[role]?.id_back || ""}
                          alt={`${role} ID Back`}
                          className="w-1/2 h-auto rounded-lg"
                        />
                      </a>
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
                <form action={handleApprove.bind(null, agent._id)}>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700"
                    disabled={agent.agentStatus === "active"}
                  >
                    {agent.agentStatus === "active" ? "Approved" : "Approve"}
                  </button>
                </form>
                <form action={handleDelete.bind(null, agent._id)}>
                  <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700">
                    Delete
                  </button>
                </form>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
      {selectedImage && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100%",
            height: "100%",
            backgroundColor: "rgba(0, 0, 0, 0.8)",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <div
            style={{
              backgroundColor: "white",
              padding: "20px",
              borderRadius: "8px",
              maxWidth: "80%",
              maxHeight: "80%",
              overflow: "auto",
            }}
          >
            <Image
              src={selectedImage}
              alt="Selected Image"
              style={{ width: "100%", height: "auto" }}
            />

            <form action={handleImageModalClose}>
              <button
                type="submit"
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-700 mt-4"
              >
                Close
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminAgentsPage;
