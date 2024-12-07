import React from "react";
import {
  Form,
  Input,
  Select,
  SelectItem,
  Button,
  Textarea,
  Checkbox,
} from "@nextui-org/react";

const AgentForm = () => {
  const handleSubmit = (event) => {
    event.preventDefault();
    // Handle form submission
  };

  return (
    <Form onSubmit={handleSubmit}>
      <h2>Dagna Information</h2>
      <Input
        label="First Name"
        placeholder="Enter first name"
        name="dagna.firstName"
      />
      <Input
        label="Father's Name"
        placeholder="Enter father's name"
        name="dagna.fatherName"
      />
      <Input
        label="Mother's Name"
        placeholder="Enter mother's name"
        name="dagna.motherName"
      />
      <Input
        label="Phone Number"
        placeholder="Enter phone number"
        name="dagna.phoneNumber"
      />

      <h2>Sebsabi Information</h2>
      <Input
        label="First Name"
        placeholder="Enter first name"
        name="sebsabi.firstName"
      />
      <Input
        label="Father's Name"
        placeholder="Enter father's name"
        name="sebsabi.fatherName"
      />
      <Input
        label="Mother's Name"
        placeholder="Enter mother's name"
        name="sebsabi.motherName"
      />
      <Input
        label="Phone Number"
        placeholder="Enter phone number"
        name="sebsabi.phoneNumber"
      />

      <h2>Tsehafi Information</h2>
      <Input
        label="First Name"
        placeholder="Enter first name"
        name="tsehafi.firstName"
      />
      <Input
        label="Father's Name"
        placeholder="Enter father's name"
        name="tsehafi.fatherName"
      />
      <Input
        label="Mother's Name"
        placeholder="Enter mother's name"
        name="tsehafi.motherName"
      />
      <Input
        label="Phone Number"
        placeholder="Enter phone number"
        name="tsehafi.phoneNumber"
      />

      <Textarea
        label="Description"
        placeholder="Enter description"
        name="description"
      />
      <Input label="Equb Name" placeholder="Enter equb name" name="equbName" />

      <h2>Bank Information</h2>
      <Input
        label="Bank Name"
        placeholder="Enter bank name"
        name="banks[0].bankName"
      />
      <Input
        label="Account Number"
        placeholder="Enter account number"
        name="banks[0].accountNumber"
      />

      <Select label="Equb Type" name="equbType">
        <SelectItem value="monthly">Monthly</SelectItem>
        <SelectItem value="weekly">Weekly</SelectItem>
      </Select>

      <Input
        type="number"
        label="Equb Amount"
        placeholder="Enter equb amount"
        name="equbAmount"
      />

      <Select label="Agent Status" name="agentStatus">
        <SelectItem value="active">Active</SelectItem>
        <SelectItem value="passive">Passive</SelectItem>
        <SelectItem value="frozen">Frozen</SelectItem>
      </Select>

      <Button type="submit" color="primary">
        Submit
      </Button>
    </Form>
  );
};
export default AgentForm;
