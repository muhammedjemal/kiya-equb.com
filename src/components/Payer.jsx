import { Equb, Payment, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Link from "next/link";
const getPayer = async (paymentId) => {
  "use server";
  try {
    // Example: Fetch Equb count for the user
    console.log("kj");

    await connectToDb();
    console.log("kj");
    // console.log(userId);
    // console.log("kj");

    const payment = await Payment.findById(paymentId);
    if (payment !== undefined) {
      console.log(payment.amount);
    }
    const equbId = payment.forEqub;
    // find the user which has the equb id inside its array of activeEqubs of the user
    const equb = await Equb.findById(equbId);
    const userId = equb.owner;
    const user = await User.findById(userId);
    const firstName = user.firstName;
    const lastName = user.lastName;
    const id = user.id;
    return { firstName, lastName, id };
  } catch (error) {
    console.error("Error fetching Equb count:", error);
    return "notActive"; // Handle error state if needed
  } finally {
    console.log("either way logged!");
  }
};
const Payer = async ({ paymentId }) => {
  console.log(paymentId);
  const res = await getPayer(paymentId);

  return (
    <Link href={`/admin/users/${res.id}`}>
      <span>
        {res?.firstName} {res?.lastName}
      </span>
    </Link>
  );
};

export default Payer;
