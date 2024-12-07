import Link from "next/link";

const ReferralList = ({ referrals }) => {
  return (
    <div className="mt-4">
      <h2 className="text-xl font-bold mb-2">
        Referrals ({referrals.length}):
      </h2>
      {referrals.length > 0 ? (
        <ol className="list-decimal list-inside">
          {referrals.map((referral) => (
            <li key={referral.id} className="mb-2">
              <Link
                href={`/admin/users/${referral.id}`}
                className="flex items-center"
              >
                <h3 className="text-lg font-medium mr-2">
                  {referral.firstName} {referral.lastName}
                </h3>
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="green"
                  className="ml-2"
                >
                  <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                </svg>
              </Link>
            </li>
          ))}
        </ol>
      ) : (
        <p className="text-gray-500">No referrals yet.</p>
      )}
    </div>
  );
};

export default ReferralList;
