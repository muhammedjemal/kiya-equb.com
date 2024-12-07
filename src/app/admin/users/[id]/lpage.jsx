import { Copier } from "@/app/ui/Copier";
import styles from "@/app/ui/dashboard/users/singleUser/singleUser.module.css";
import { auth } from "@/lib/auth";
import { Equb, User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { revalidatePath } from "next/cache";
import Link from "next/link";
import UserProfileForm from "./UserProfileForm";
import EqubCreationForm from "./EqubCreationForm";
import ReferralList from "./ReferralList";
import EqubList from "./EqubList";
import DailyAnalytics from "./DailyAnalytics";
import UserHeader from "./UserHeader";
import ManagerPlacement from "./ManagerPlacement";

const SingleUserPage = async ({ params }) => {
  await connectToDb();

  let loggedInUser = await auth();
  if (!loggedInUser) {
    return (
      <h1 className="text-center text-3xl font-bold">Please Login first!</h1>
    );
  }

  const id = loggedInUser.user.id;
  loggedInUser = await User.findById(id);

  let paramsUser;
  try {
    paramsUser = await User.findById(params.id);
  } catch {
    return (
      <div className="flex justify-center items-center h-screen">
        <h1 className="text-3xl font-bold text-red-500">Invalid user ID</h1>
      </div>
    );
  }

  const equbs = await Equb.find({ owner: paramsUser.id });
  const managersAll = await User.find({
    managerMembers: { $exists: true, $ne: null },
  });
  const refferals = await User.find({ refferedBy: paramsUser.id });

  return (
    <div className="p-4">
      <UserHeader user={paramsUser} loggedInUser={loggedInUser} />
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <UserProfileForm
            user={paramsUser}
            loggedInUser={loggedInUser}
            managers={managersAll}
          />
          {paramsUser.managerMembers === null &&
            paramsUser.collectorOf === null &&
            paramsUser.isSystemAdmin === false &&
            loggedInUser.oprator !== true &&
            loggedInUser.collectorOf === null && (
              <EqubCreationForm ownerId={paramsUser.id} />
            )}
          <ReferralList referrals={refferals} />
          <EqubList equbs={equbs} />
        </div>
        <div>
          <DailyAnalytics user={paramsUser} loggedInUser={loggedInUser} />
        </div>
      </div>
    </div>
  );
};

export default SingleUserPage;
