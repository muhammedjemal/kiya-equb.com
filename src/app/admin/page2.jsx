// "use client";

import React from "react";
const AdminServerPage = () => {
  return (
    <div>
      <h1>Admin Page</h1>
      <p>Welcome to the admin page!</p>
      {children(session)}
    </div>
  );
};

export default AdminServerPage;
