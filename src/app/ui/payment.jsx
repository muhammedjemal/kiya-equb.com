"use client";
var status = "pending";
import Link from "next/link";
import React from "react";

const PaymentDetails = ({ payment }) => {
  const handleConfirm = () => {
    // Implement confirm functionality here
    console.log("Payment confirmed");
  };

  const handleReject = () => {
    // Implement reject functionality here
    console.log("Payment rejected");
  };

  const handleDelete = () => {
    // Implement delete functionality here
    console.log("Payment deleted");
  };

  return (
    <div style={styles.paymentDetails}>
      <div style={styles.field}>
        <strong>Payment amount:</strong> {payment?.amount}
      </div>
      <div style={styles.field}>
        <strong>Payment date:</strong> {payment?.date}
      </div>
      <div style={styles.field}>
        <strong>Payment status: </strong>
        {status === "confirmed" && (
          <span
            style={{
              backgroundColor: "green",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            Confirmed
          </span>
        )}
        {status === "rejected" && (
          <span
            style={{
              backgroundColor: "orange",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            Rejected
          </span>
        )}
        {status === "pending" && (
          <span
            style={{
              backgroundColor: "gray",
              color: "white",
              border: "none",
              padding: "5px 10px",
              borderRadius: "5px",
              marginRight: "10px",
            }}
          >
            Pending
          </span>
        )}
      </div>

      {payment?.proofImageUrl && (
        <div style={styles.field}>
          <strong>Payment proof:</strong>{" "}
          <Link href={payment?.proofImageUrl}>View ↗</Link>
          {payment?.status === "pending" && (
            <div style={styles.field}>
              <button
                style={styles.actionButtonConfirm}
                onClick={handleConfirm}
              >
                Confirm
              </button>
              <button style={styles.actionButtonReject} onClick={handleReject}>
                Reject
              </button>
              <button style={styles.actionButtonDelete} onClick={handleDelete}>
                ⚠ Delete
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

const styles = {
  paymentDetails: {
    padding: "20px",
    border: "1px solid #ddd",
    borderRadius: "5px",
    backgroundColor: "#0d0c22",
    marginTop: "20px",
    color: "white",
  },
  field: {
    marginBottom: "15px",
    marginTop: "15px",
  },
  status: {
    backgroundColor:
      status === "confirmed"
        ? "green"
        : status === "rejected"
        ? "orange"
        : "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  actionButtonSlate: {
    backgroundColor: "gold",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  actionButtonConfirm: {
    backgroundColor: "green",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  actionButtonReject: {
    backgroundColor: "orange",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  actionButtonDelete: {
    backgroundColor: "red",
    color: "white",
    border: "none",
    padding: "5px 10px",
    borderRadius: "5px",
    cursor: "pointer",
    marginRight: "10px",
  },
  imageContainer: {
    marginTop: "10px",
  },
  image: {
    maxWidth: "100%",
    height: "auto",
    border: "1px solid #ddd",
    borderRadius: "5px",
  },
};

export default PaymentDetails;
