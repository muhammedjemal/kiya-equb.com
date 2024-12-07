import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Link from "next/link";

export const PaymentReceiver = async ({ payment }) => {
  await connectToDb();
  let user;

  try {
    user = await User.findById(payment.to);
  } catch {
    console.log("err format of 'payment.to'");
  }

  console.log(user);

  return (
    <div>
      {user ? (
        <>
          <Link href={`/admin/users/${user?.id}`}>
            <h3>{user && user?.firstName + " " + user?.lastName}</h3>
            <h3>{!user && "Owner"}</h3>
          </Link>
        </>
      ) : (
        <>
          <h3>{user && user?.firstName + " " + user?.lastName}</h3>
          <h3>{!user && "Owner"}</h3>
        </>
      )}
    </div>
  );
};
