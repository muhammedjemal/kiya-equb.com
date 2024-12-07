// import { LiveStream } from "@/lib/models";
// import { connectToDb } from "@/lib/utils";
// import { NextResponse } from "next/server";

// export const GET = async () => {
//   console.log("postttt");

//   try {
//     console.log("connecting..");
//     await connectToDb();
//     console.log("connected..");

//     /////
//     // Find Equbs owned by the user
//     const liveStreams = await LiveStream.find({});
//     console.log("tryingg..");

//     // Extract array of Equb ids (as strings)

//     return NextResponse.json({ liveStreams });
//   } catch (err) {
//     console.log(err);
//     return NextResponse.json(
//       { error: "field to get payments of the equb!" },
//       { status: 500 }
//     );
//   }
// };

import { LiveStream } from "@/lib/models";
import { connectToDb } from "@/lib/utils";
import { NextResponse } from "next/server";

export const GET = async () => {
  console.log("Fetching live streams...");

  try {
    console.log("Connecting to the database...");
    await connectToDb();
    console.log("Connected to the database.");

    // Fetch live streams and populate the liveCreatorId field
    const liveStreams = await LiveStream.find({}).populate(
      "liveCreatorId",
      "firstName lastName phoneNumber"
    ); // Replace fields with actual ones from the User schema
    console.log("Live streams fetched successfully.");

    return NextResponse.json({ liveStreams });
  } catch (err) {
    console.error("Error fetching live streams:", err);
    return NextResponse.json(
      { error: "Failed to fetch live streams." },
      { status: 500 }
    );
  }
};
