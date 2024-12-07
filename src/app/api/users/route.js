import { connectToDb } from "@/lib/utils";
import { User } from "@/lib/models";
import { NextResponse } from "next/server";

// Fetch users API route
export async function GET(req) {
  const { q = "", page = 1, fetchId = "no" } = req.nextUrl.searchParams;
  const regex = new RegExp(q, "i");
  const ITEM_PER_PAGE = 10;

  try {
    await connectToDb();
    let count;
    let users;

    if (fetchId !== "no") {
      count = await User.find({ underManager: fetchId }).countDocuments();
      users = await User.find({
        $and: [
          { underManager: fetchId },
          {
            $or: [
              { firstName: { $regex: regex } },
              { lastName: { $regex: regex } },
              { phoneNumber: { $regex: regex } },
              { motherName: { $regex: regex } },
            ],
          },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));
    } else {
      count = await User.countDocuments({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { phoneNumber: { $regex: regex } },
          { motherName: { $regex: regex } },
        ],
      });

      users = await User.find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
          { phoneNumber: { $regex: regex } },
          { motherName: { $regex: regex } },
        ],
      })
        .sort({ createdAt: -1 })
        .limit(ITEM_PER_PAGE)
        .skip(ITEM_PER_PAGE * (page - 1));
    }

    return NextResponse.json({ count, users });
  } catch (err) {
    console.log("Failed to fetch users:", err);
    return NextResponse.json({ count: 0, users: [] });
  }
}
