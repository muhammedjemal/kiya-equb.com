import { User } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import Link from "next/link";
import { CollectorTodaysAmount } from "./CollectorTodaysAmount";

export const ManagerCollectors = async ({ user, day }) => {
  await connectToDb();
  const collectors = await User.find({
    underManager: user.id, // collectorOf should contain user.id
    collectorOf: { $exists: true, $ne: null },
  });
  console.log(collectors);

  return (
    <div>
      <h1 style={{ color: "green" }}>
        Assigned collectors ({collectors.length} collectors):
      </h1>
      <ol>
        {collectors.map((collector, i) => (
          <li key={i}>
            <h3>
              <Link href={`/admin/users/${collector.id}`}>
                {collector.firstName} {collector.lastName}{" "}
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="green"
                >
                  <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                </svg>
              </Link>
              <Link
                href={`/admin/users/${
                  day === "yesterday"
                    ? "yesterdaypayments"
                    : day === "bYesterday"
                    ? "beforeyesterdaypayments"
                    : day === "b3day"
                    ? "b3day"
                    : day === "b4day"
                    ? "b4day"
                    : "payments"
                }/${collector.id}`}
              >
                <CollectorTodaysAmount collector={collector} day={day} />
                <span>
                  <i>click to see the payments received </i>{" "}
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="24px"
                    fill="green"
                  >
                    <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
                  </svg>
                </span>
              </Link>
            </h3>
          </li>
        ))}
      </ol>
      {/* // <h1>
            //   Total Payments Collected for this collector: redirects to
            //   payments link == payments collected date today, to=this collector
            // </h1> */}
    </div>
  );
};
