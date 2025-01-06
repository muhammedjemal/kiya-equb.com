// import { updateUser } from "@/app/lib/actions";
// import { fetchUser } from "@/app/lib/data";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import { auth } from "@/lib/auth";
import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";

// import the bcryptjs
import bcryptjs from "bcryptjs";
import { revalidatePath } from "next/cache";
console.log("testing");
const createUser = async (formData) => {
  "use server";
  let {
    firstName,
    lastName,
    motherName,
    phoneNumber,
    password,
    role,
    managerId,
    agentId,
  } = Object.fromEntries(formData);
  function validatePhoneNumber(phoneNumber) {
    // Check if phoneNumber is a string
    if (typeof phoneNumber !== "string") {
      throw new Error("Phone number must be a string.");
    }

    // Remove all whitespace from the phone number
    phoneNumber = phoneNumber.replace(/\s/g, "");

    // Check if phoneNumber starts with '+'
    if (phoneNumber.startsWith("+")) {
      phoneNumber = phoneNumber.slice(1); // Remove the '+' sign
    }

    // Check if phoneNumber starts with '251'
    if (phoneNumber.startsWith("251")) {
      phoneNumber = phoneNumber.slice(3); // Remove the country code '251'
    } else if (phoneNumber.startsWith("0")) {
      phoneNumber = phoneNumber.slice(1); // Remove leading '0' if present
    } else {
      throw new Error("Invalid phone number format.");
    }

    // Ensure the remaining phoneNumber consists of only numeric digits
    if (!/^\d+$/.test(phoneNumber)) {
      throw new Error("Invalid phone number format.");
    }

    // Remove leading zeros by converting to number and back to string
    phoneNumber = Number(phoneNumber).toString();

    // Ensure the formatted phone number starts with '+2519' or '+2517' and has a length of 10 digits
    if (
      !(phoneNumber.startsWith("9") && phoneNumber.length === 9) &&
      !(phoneNumber.startsWith("7") && phoneNumber.length === 9)
    ) {
      throw new Error("Invalid phone number format.");
    }

    return "+251" + phoneNumber;
  }
  try {
    validatePhoneNumber(phoneNumber);
  } catch (err) {
    console.log(err);
    return;
  }
  const validatedPhoneNumber = validatePhoneNumber(phoneNumber);

  await connectToDb();
  const existingUser = await User.findOne({
    phoneNumber: validatedPhoneNumber,
  });
  if (existingUser) {
    return;
  }

  if (!managerId) {
    managerId = "";
  }
  const hashedPassword = await bcryptjs.hash(password, 10);
  let newUser;

  if (role === "admin") {
    newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      isSystemAdmin: true,
      managerMembers: null,
      collectorOf: null,
      refferedBy: "",
    });
  } else if (role === "oprator") {
    newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      isSystemAdmin: true,
      managerMembers: null,
      collectorOf: null,
      oprator: true,
      refferedBy: "",
    });
  } else if (role === "manager") {
    newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      managerMembers: [],
      isSystemAdmin: false,
      collectorOf: null,
      refferedBy: "",
    });
  } else if (role === "collector") {
    newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      underManager: managerId,
      collectorOf: managerId,
      managerMembers: null,
      isSystemAdmin: false,
      refferedBy: "",
    });
  } else {
    newUser = new User({
      firstName,
      lastName,
      motherName,
      phoneNumber: validatedPhoneNumber,
      password: hashedPassword,
      underManager: managerId,
      managerMembers: null,
      isSystemAdmin: false,
      collectorOf: null,
      refferedBy: "",
      agentId,
    });
  }

  await newUser.save();
  console.log("saved to db");
  revalidatePath("/admin/users");
  revalidatePath("/admin/users/[id]");
  // redirect the to the admin/users using push in next js
};

const SingleUserPage = async () => {
  const session1 = await auth();
  const loggedInUser1 = session1.user;
  await connectToDb();
  const userLive1 = await User.findById(loggedInUser1.id);
  if (userLive1.oprator === true || userLive1.collectorOf !== null) {
    return (
      <>
        <div className={styles.container}>
          <h1>Not allowed!</h1>
        </div>
      </>
    );
  }

  const managers = await User.find({
    managerMembers: { $exists: true, $ne: null },
  });
  console.log(managers.length);
  // temporary user
  let loggedInUser = await auth();
  console.log(loggedInUser);
  let { user } = loggedInUser;
  user = await User.findById(user.id);
  console.log(user.id);

  return (
    <div className={styles.container}>
      <div className={styles.formContainer}>
        <form action={createUser} className={styles.form}>
          <label>First Name:</label>
          <input type="text" name="firstName" />
          <label>Last Name:</label>
          <input type="text" name="lastName" />
          <label>Mother Name:</label>
          <input type="text" name="motherName" />
          <label>Phone Number:</label>
          <input type="text" name="phoneNumber" />
          <label>Password:</label>
          <input type="text" name="password" />
          {/* if current user is not admin the following two will be hidden: */}
          {user.role.includes("a") && (
            <input type="hidden" name="agentId" value={userLive1.agentId} />
          )}
          {user.isSystemAdmin && !user.role.includes("a") && (
            <>
              <label>Role: ⭐</label>
              <select name="role" id="role">
                <option value={"client"}>Client</option>
                <option value={"collector"}>Payment Collector</option>
                <option value={"manager"}>Manager</option>
                <option value={"admin"}>System Admin</option>
                <option value={"oprator"}>Oprator</option>
              </select>
            </>
          )}
          {/* 
          // for client choosing under which manager
          // for collector choosing under which manager
          // for admin this option will be hidden
          */}
          {/* if the current user is already a collector or manager make placement under them not let them choose, only admin can*/}
          {user.isSystemAdmin && !user.role.includes("a") ? (
            <>
              <label>Placement: ⭐</label>
              <select name="managerId" id="placement">
                {/* if manager.managerMembers array includes the user's id as one of the list */}
                <option value="">Select Manager</option>

                {managers.map((manager) => (
                  <>
                    <option value={manager.id}>
                      {manager.firstName} {manager.lastName}
                    </option>
                  </>
                ))}
              </select>
            </>
          ) : user.collectorOf !== null ? (
            <>
              <input
                type="hidden"
                name="managerId"
                value={user.collectorOf}
                is="collector"
              />
            </>
          ) : (
            user.managerMembers !== null && (
              <>
                <input
                  type="hidden"
                  name="managerId"
                  value={user.id}
                  is="manager"
                />
              </>
            )
          )}
          {/* if the user is a collector hide the Update button for him */}
          <button>Create</button>
        </form>
        {/* <p>other</p> */}
      </div>
    </div>
  );
};

export default SingleUserPage;
