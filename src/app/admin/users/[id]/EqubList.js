import EqubDetails from "@/app/ui/equb"; // Assuming this component is defined

const EqubList = ({ equbs }) => {
  return (
    <div className="mt-4">
      {equbs.length > 0 ? (
        <>
          <h1 className="text-xl font-bold mb-2">Equbs ({equbs.length})</h1>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {" "}
            {/* Responsive grid layout */}
            {equbs.map((equb, i) => (
              <EqubDetails equb={equb} key={i} />
            ))}
          </div>
        </>
      ) : (
        <p className="text-gray-500">No Equbs found for this user.</p>
      )}
    </div>
  );
};

export default EqubList;
