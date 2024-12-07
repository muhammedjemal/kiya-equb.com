import mongoose from "mongoose";

// const userSchema = new mongoose.Schema(
//   {
//     username: {
//       type: String,
//       required: true,
//       unique: true,
//       min: 3,
//       max: 20,
//     },
//     email: {
//       type: String,
//       required: true,
//       unique: true,
//       max: 50,
//     },
//     password: {
//       type: String,
//     },
//     img: {
//       type: String,
//     },
//     isAdmin: {
//       type: Boolean,
//       default: false,
//     },
//   },
//   { timestamps: true }
// );
const userSchema = new mongoose.Schema( // avoid default values
  {
    underManager: { type: String },
    firstName: { type: String },
    lastName: { type: String },
    motherName: { type: String },
    img: { type: String },
    idFront: { type: String }, // new
    idBack: { type: String }, // new
    role: {
      // new
      type: String,
      enum: ["sebsabi", "dagna", "tsehafi"],
    },
    agentId: { type: mongoose.Schema.Types.ObjectId, ref: "Agent" }, // [obj, new] // i will use it to ckeck like admin
    // phone number must be unique!
    oprator: { type: Boolean, default: false },
    phoneNumber: { type: String, unique: true },
    password: { type: String },
    isSystemAdmin: { type: Boolean, default: false },
    refferedBy: { type: String }, // id of the user who reffered the user
    activeEqubs: { type: [String], default: [] }, // delit
    collectorOf: { type: String, default: null }, // string or null, id of the manager under whom collecting
    managerMembers: { type: [String], default: null }, // list of ids of users of the memebers of the manager(if current user is a manager) otherwise null (user is not a manager)
  },
  { timestamps: true }
);

const paymentSchema = new mongoose.Schema(
  {
    from: { type: String },
    to: { type: String }, // id of a admin or manager or a collector (note: if manualy the ##client paying it will be the ###verifier but if the ###receiver-admin/collector/manager himself recieved it will be the ##reciever)
    forEqub: { type: String }, // id of an equb the payment is being made

    date: { type: Date },
    isStartDay: { type: Boolean, default: false },
    startDate: { type: Date },
    imageProof: { type: String },
    amount: { type: Number },
    status: {
      type: String,
      enum: ["received", "pending", "rejected"],
      default: "pending",
    },
    seen: { type: Boolean, default: false },
  },
  { timestamps: true }
);

const equbSchema = new mongoose.Schema(
  {
    owner: { type: String }, // id of the user who owns the equb
    payments: [{ type: String }], // ids of payments
    type: { type: String },
    name: { type: String },
    amount: { type: Number },
    startDate: { type: Date },
    endDate: { type: Date },
  },
  { timestamps: true }
);
// const postSchema = new mongoose.Schema(
//   {
//     title: {
//       type: String,
//       required: true,
//     },
//     desc: {
//       type: String,
//       required: true,
//     },
//     img: {
//       type: String,
//     },
//     userId: {
//       type: String,
//       required: true,
//     },
//     slug: {
//       type: String,
//       required: true,
//       unique: true,
//     },
//   },
//   { timestamps: true }
// );
const SystemInfoSchema = new mongoose.Schema({
  developer: {
    type: String,
    default: "",
  },
  termsEn: {
    type: String,
    default: "",
  },
  termsAm: {
    type: String,
    default: "",
  },
  termsOr: {
    type: String,
    default: "",
  },
  message: {
    type: String,
    default: "",
  },
});

const agentSchema = new mongoose.Schema(
  {
    dagna: {
      firstName: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String },
      phoneNumber: { type: String, required: true },
      avatar: { type: String, required: true },
      id_front: { type: String, required: true },
      id_back: { type: String, required: true },
    },
    sebsabi: {
      firstName: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String },
      phoneNumber: { type: String, required: true },
      avatar: { type: String, required: true },
      id_front: { type: String, required: true },
      id_back: { type: String, required: true },
    },
    tsehafi: {
      firstName: { type: String, required: true },
      fatherName: { type: String, required: true },
      motherName: { type: String },
      phoneNumber: { type: String, required: true },
      avatar: { type: String, required: true },
      id_front: { type: String, required: true },
      id_back: { type: String, required: true },
    },
    description: { type: String, required: true },
    equbName: { type: String, required: true },
    banks: [
      {
        bankName: { type: String, required: true },
        accountNumber: { type: String, required: true },
      },
    ],
    equbAmount: { type: Number, required: true },
    equbType: {
      type: String,
      enum: ["monthly", "weekly", "daily"],
      required: true,
    },
    agentStatus: {
      type: String,
      enum: ["active", "passive", "frozen"],
      default: "passive",
    },
    claimedUsersIdList: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    unClaimedUsersIdList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
    membershipRequeststedUsersIdList: [
      { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    ],
  },
  { timestamps: true }
);

const etaSchema = new mongoose.Schema(
  {
    etaName: { type: String, required: true },
    etaDescription: { type: String },
    etaAvatar: { type: String },
    etaStatus: {
      type: String,
      enum: ["active", "streamingNow", "expired", "scheduled"],
      default: "scheduled",
    },
    subscribersList: [
      {
        userId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
        paymentImageLink: { type: String },
      },
    ],
  },
  { timestamps: true }
);

const liveStreamSchema = new mongoose.Schema(
  {
    liveReasonFor: {
      type: String,
      enum: ["eta", "equb"],
      default: "equb",
    },
    liveCreatorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Replace "User" with the actual collection name if different
    },
    liveLink: {
      type: String,
    },
    name: {
      type: String,
    },
    avatar: {
      type: String,
    },
    description: {
      type: String,
    },
    status: {
      type: String,
      enum: ["live", "scheduled", "ended"],
      default: "scheduled",
    },
  },
  { timestamps: true } // Automatically adds createdAt and updatedAt fields
);
// src/models/Image.js

const ImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

// export const Image =
//   mongoose.models.Image || mongoose.model("Image", ImageSchema);

// Create model
export const LiveStream =
  mongoose.models?.LiveStream || mongoose.model("LiveStream", liveStreamSchema);

// Create model
export const Eta = mongoose.models?.Eta || mongoose.model("Eta", etaSchema);

// Create model
export const SystemInfo =
  mongoose.models?.SystemInfo || mongoose.model("SystemInfo", SystemInfoSchema);

export const User = mongoose.models?.User || mongoose.model("User", userSchema);
export const Payment =
  mongoose.models?.Payment || mongoose.model("Payment", paymentSchema);
export const Equb = mongoose.models?.Equb || mongoose.model("Equb", equbSchema);
export const Agent =
  mongoose.models?.Agent || mongoose.model("Agent", agentSchema);
