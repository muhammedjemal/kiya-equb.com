// lib/hooks/useDashboardData.js
import { useEffect, useState } from "react";
import { User, Payment, Equb } from "@/lib/models";

const useDashboardData = () => {
  const [data, setData] = useState({
    users: 0,
    payments: 0,
    equbs: 0,
    todayPayments: 0,
    todayPaymentsAmount: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      const users = await User.estimatedDocumentCount();
      const payments = await Payment.estimatedDocumentCount();
      const equbs = await Equb.estimatedDocumentCount();

      const today = new Date();
      const startOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate()
      );
      const endOfDay = new Date(
        today.getFullYear(),
        today.getMonth(),
        today.getDate() + 1
      );

      const todayPayments = await Payment.countDocuments({
        $or: [
          {
            createdAt: { $gte: startOfDay, $lt: endOfDay },
            $and: [
              { isStartDay: { $ne: true } },
              { startDate: { $exists: false } },
            ],
          },
          { startDate: { $gte: startOfDay, $lt: endOfDay }, isStartDay: true },
        ],
      });

      const todayPaymentsAmount = await Payment.find({
        $or: [
          {
            createdAt: { $gte: startOfDay, $lt: endOfDay },
            $and: [
              { isStartDay: { $ne: true } },
              { startDate: { $exists: false } },
            ],
          },
          { startDate: { $gte: startOfDay, $lt: endOfDay }, isStartDay: true },
        ],
      });

      const sumPayments = todayPaymentsAmount.reduce(
        (sum, payment) => sum + payment.amount,
        0
      );

      setData({ users, payments, equbs, todayPayments, sumPayments });
    };

    fetchData();
  }, []);

  return data;
};

export default useDashboardData;
