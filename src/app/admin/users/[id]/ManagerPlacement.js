const ManagerPlacement = ({ user, loggedInUser, managers }) => {
  //This component is only relevant if the logged-in user is an admin and not an operator
  if (!loggedInUser.isSystemAdmin || loggedInUser.oprator) {
    return null;
  }

  const handleChange = (e) => {
    //This functionality should be handled by the parent component (UserProfileForm)
    //Consider removing this function from here.
    console.log("Manager changed to:", e.target.value);
  };

  return (
    <div className="mt-4">
      <label
        className="block text-gray-700 text-sm font-bold mb-2"
        htmlFor="managerId"
      >
        Placement: ⭐
      </label>
      <select
        className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
        name="managerId"
        onChange={handleChange}
        value={user.underManager} // Pre-select current manager
      >
        <option value="">Select Manager</option>
        {managers.map((manager) => (
          <option key={manager.id} value={manager.id}>
            {manager.firstName} {manager.lastName}
          </option>
        ))}
      </select>
    </div>
  );
};

export default ManagerPlacement;
