import Link from "next/link";
import { convertToEthiopianDateMoreEnhanced } from "./dateConverter";
import { formatEthiopianDate } from "./dateHelper";
import { CollectorTodaysAmount } from "@/components/CollectorTodaysAmount";
import { CollectorsTodaysAmount } from "@/components/CollectorsTodaysAmount";
import { CollectorsAndManagerTodaysAmount } from "@/components/CollectorsAndManagerTodaysAmount";

const DailyAnalytics = ({ user, loggedInUser }) => {
  const todaysDate = new Date();
  const yesterdaysDate = new Date(todaysDate);
  yesterdaysDate.setDate(todaysDate.getDate() - 1);
  const bYesterdaysDate = new Date(todaysDate);
  bYesterdaysDate.setDate(todaysDate.getDate() - 2);

  const renderAnalyticsSection = (date, label, hrefPrefix) => {
    return (
      <div className="bg-gray-100 p-4 rounded mb-4">
        <h2 className="text-lg font-bold mb-2 text-green-600">
          {label} ({formatEthiopianDate(date)}) analytics:
        </h2>
        {user.managerMembers !== null && (
          <>
            <Link
              href={`${hrefPrefix}/${user.id}`}
              className="flex items-center mb-2"
            >
              <h3 className="text-base font-medium mr-2">
                Manager's amount received:{" "}
                <span className="font-bold">
                  <CollectorTodaysAmount
                    collector={user}
                    day={label.toLowerCase()}
                  />
                </span>
              </h3>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="16px"
                viewBox="0 -960 960 960"
                width="16px"
                fill="green"
                className="ml-2"
              >
                <path d="m216-160-56-56 464-464H360v-80h400v400h-80v-264L216-160Z" />
              </svg>
            </Link>
            <p className="text-sm text-gray-600">
              click to see the payments received
            </p>

            <p className="mb-2">
              Manager's collectors received:{" "}
              <span className="font-bold">
                <CollectorsTodaysAmount
                  mngrId={user.id}
                  day={label.toLowerCase()}
                />
              </span>
            </p>
            <p className="mb-2">
              Total Manager's and collectors received:{" "}
              <span className="font-bold underline">
                <CollectorsAndManagerTodaysAmount
                  mngrId={user.id}
                  day={label.toLowerCase()}
                />
              </span>
            </p>
          </>
        )}

        {user.collectorOf !== null && (
          <Link href={`${hrefPrefix}/${user.id}`}>
            <p>
              Collector's money collection status:{" "}
              <CollectorTodaysAmount
                collector={user}
                day={label.toLowerCase()}
              />
            </p>
            <p className="text-sm text-gray-600">
              click to see the payments received
            </p>
          </Link>
        )}
        {user.isSystemAdmin === true && (
          <Link href={`${hrefPrefix}/${user.id}`}>
            <p>
              {`${user.oprator === true ? "Oprator" : "Admin"}`}
              's money collection status:{" "}
              <CollectorTodaysAmount
                collector={user}
                day={label.toLowerCase()}
              />
            </p>
            <p className="text-sm text-gray-600">
              click to see the payments received
            </p>
          </Link>
        )}
      </div>
    );
  };

  return (
    <div className="mt-4">
      {user.managerMembers !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(todaysDate, "Today", "/admin/users/payments")}
      {user.collectorOf !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(todaysDate, "Today", "/admin/users/payments")}
      {user.isSystemAdmin === true &&
        renderAnalyticsSection(todaysDate, "Today", "/admin/users/payments")}

      {user.managerMembers !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(
          yesterdaysDate,
          "Yesterday",
          "/admin/users/yesterdaypayments"
        )}
      {user.collectorOf !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(
          yesterdaysDate,
          "Yesterday",
          "/admin/users/yesterdaypayments"
        )}
      {user.isSystemAdmin === true &&
        renderAnalyticsSection(
          yesterdaysDate,
          "Yesterday",
          "/admin/users/yesterdaypayments"
        )}

      {user.managerMembers !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(
          bYesterdaysDate,
          "Before Yesterday",
          "/admin/users/beforeyesterdaypayments"
        )}
      {user.collectorOf !== null &&
        loggedInUser.oprator !== true &&
        renderAnalyticsSection(
          bYesterdaysDate,
          "Before Yesterday",
          "/admin/users/beforeyesterdaypayments"
        )}
      {user.isSystemAdmin === true &&
        renderAnalyticsSection(
          bYesterdaysDate,
          "Before Yesterday",
          "/admin/users/beforeyesterdaypayments"
        )}
    </div>
  );
};

export default DailyAnalytics;
