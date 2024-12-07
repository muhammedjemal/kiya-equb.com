import { Copier } from "@/app/ui/Copier";
import { Copier2 } from "@/components/Copier2";
import Image from "next/image";
// import { Copier, Copier2 } from "@/app/ui"; // Adjust path as needed

const UserHeader = ({ user, loggedInUser }) => {
  return (
    <div className="mb-4">
      <div className="flex items-center mb-4">
        <div className="mr-4">
          <Image
            className="rounded-full"
            src={user.img || "/noavatar.png"}
            alt={`${user.firstName} ${user.lastName}`}
            width={100}
            height={100}
          />
        </div>
        <div>
          {loggedInUser.id === user.id ? (
            <h1 className="text-2xl font-bold">My Account</h1>
          ) : (
            <h1 className="text-2xl font-bold">
              {user.firstName} {user.lastName}
            </h1>
          )}
        </div>
      </div>
      <div className="flex items-center">
        {loggedInUser.id === user.id ? null : (
          <Copier2 phone={user.phoneNumber} />
        )}
        <Copier code={user.id} className="ml-4" />
        <span className="ml-4 font-medium">Referral Code: {user.id}</span>{" "}
        {/*Added direct display for simplicity*/}
      </div>
    </div>
  );
};

export default UserHeader;
