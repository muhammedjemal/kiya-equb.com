import Link from "next/link";

const { User, Equb } = require("@/lib/models");
const { connectToDb } = require("@/lib/utils");

export const Owner = async ({ equbId }) => {
  await connectToDb();
  // find the user which has the equb id inside its array of activeEqubs of the user
  const equb = await Equb.findById(equbId);
  const userId = equb.owner;
  const user = await User.findById(userId);

  console.log(user);

  return (
    <div>
      <Link href={`/admin/users/${user?.id}`}>
        <h1>
          Owner full Name: {user?.firstName} {user?.lastName}
        </h1>
        <h1>Phone number: {user?.phoneNumber}</h1>
      </Link>
    </div>
  );
};
