import mongoose, { Schema, model, models } from "mongoose";

const ComplaintSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    category: {
      type: String,
      required: true,
      enum: [
        "HOSTEL",
        "MESS",
        "ACADEMIC",
        "INTERNET",
        "INFRASTRUCTURE",
        "OTHERS",
      ],
    },

    status: {
      type: String,
      default: "OPEN",
      enum: ["OPEN", "IN_PROGRESS", "RESOLVED", "ESCALATED"],
      index: true,
    },

    priority: {
      type: String,
      default: "NORMAL",
      enum: ["NORMAL", "HIGH", "CRITICAL"],
    },

    createdBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    claimedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },

    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.Complaint || model("Complaint", ComplaintSchema);
