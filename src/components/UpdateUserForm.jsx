"use client";
import { Copier } from "@/app/ui/Copier";
import { Copier2 } from "./Copier2";
import Link from "next/link";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import Image from "next/image";
import { updateUser } from "@/lib/action";
import { useFormState } from "react-dom";

export const UpdateUserForm = ({
  managersAll,
  paramsUser,

  loggedInUser,
}) => {
  const [state, formAction] = useFormState(updateUser, undefined);
  console.log(managersAll);
  console.log(paramsUser);
  console.log(loggedInUser);

  return (
    <form action={formAction} className={styles.form}>
      <input type="hidden" name="id" value={paramsUser.id} />
      {/* make Copier element from right-most side from the line using css inline style code */}
      {loggedInUser.id === paramsUser.id ? (
        <>
          <Image
            className={styles.userImage}
            src={paramsUser?.img || "/noavatar.png"}
            alt=""
            width="100"
            height="100"
          />

          <h1>My Account</h1>
        </>
      ) : (
        <Copier2 phone={paramsUser.phoneNumber} />
      )}
      <Copier code={paramsUser.id} style={{}} />
      <label style={{ display: "inline-block", width: "100px" }}>
        Referral Code:
      </label>
      {/*refferal code copying to the clipboard button element: */}
      <input
        type="text"
        placeholder={paramsUser.id}
        style={{ display: "inline" }}
        readOnly
      />
      <label>First Name:</label>
      <input type="text" name="firstName" placeholder={paramsUser.firstName} />
      <label>Last Name:</label>
      <input type="text" name="lastName" placeholder={paramsUser.lastName} />
      <label>Mother Name:</label>
      <input
        type="text"
        name="motherName"
        placeholder={paramsUser.motherName}
      />
      <label>Phone Number:</label>
      <input
        type="text"
        name="phoneNumber"
        placeholder={paramsUser.phoneNumber}
      />{" "}
      {loggedInUser.oprator !== true && loggedInUser.collectorOf === null && (
        <label>Password:</label>
      )}
      {loggedInUser.oprator !== true && loggedInUser.collectorOf === null && (
        <input
          type="text"
          name="password"
          placeholder={"enter new password..."}
        />
      )}
      {loggedInUser.managerMembers !== null
        ? loggedInUser.id === paramsUser.underManager &&
          "This user is placed to you."
        : paramsUser.underManager &&
          paramsUser.underManager !== "" &&
          paramsUser.isSystemAdmin === false &&
          loggedInUser.oprator !== true &&
          loggedInUser.collectorOf === null && (
            <Link href={`/admin/users/${paramsUser.underManager}`}>
              <b> View Current Placement Manager</b>{" "}
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="34px"
                fill="green"
              >
                <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
              </svg>
            </Link>
          )}
      {/* if current user is not admin the following two will be hidden: */}
      {/* 
          // for client choosing under which manager 
          // for collector choosing under which manager 
          // for admin this option will be hidden
          */}
      {/* if there are managers otherwise say no managers please add at least one manager to make placement for this user */}
      {/* if the user is a collector hide the Update button for him */}
      {loggedInUser.isSystemAdmin && loggedInUser.oprator !== true && (
        <>
          <label>Placement: ⭐</label>
          <select name="managerId" id="managerId">
            {/* if manager.managerMembers array includes the user's id as one of the list */}
            <option value="">Select Manager</option>
            {managersAll.map((manager) => (
              <>
                <option value={manager.id}>
                  {manager.firstName} {manager.lastName}
                </option>
              </>
            ))}
          </select>
        </>
      )}
      {loggedInUser.managerMembers !== null
        ? loggedInUser.id === paramsUser.underManager && <button>Update</button>
        : loggedInUser.oprator !== true &&
          loggedInUser.collectorOf === null && <button>Update</button>}
      {state?.error}
    </form>
  );
};
