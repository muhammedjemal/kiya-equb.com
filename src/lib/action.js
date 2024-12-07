"use server";

import { signIn, signOut } from "./auth";

export const handleGithubLogin = async () => {
  "use server";
  await signIn("github");
};

export const handleLogout = async () => {
  "use server";
  await signOut();
};

export const login = async (prevState, formData) => {
  const { password, phoneNumber } = Object.fromEntries(formData);
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
    return { error: err.message };
  }
  const validatedPhoneNumber = validatePhoneNumber(phoneNumber);

  try {
    await signIn("credentials", {
      password,
      phoneNumber: validatedPhoneNumber,
    });
  } catch (err) {
    console.log(err.message);

    if (err.message.toLowerCase().includes("credentialssignin")) {
      return { error: "Invalid username or password" };
    }
    throw err;
  }
};
