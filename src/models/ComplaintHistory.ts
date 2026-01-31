import mongoose, { Schema, model, models } from "mongoose";

const ComplaintHistorySchema = new Schema(
  {
    complaintId: {
      type: Schema.Types.ObjectId,
      ref: "Complaint",
      required: true,
      index: true,
    },

    action: {
      type: String,
      required: true,
      enum: [
        "CREATED",
        "CLAIMED",
        "STATUS_CHANGED",
        "PRIORITY_CHANGED",
        "ESCALATED",
        "RESOLVED",
      ],
      index: true,
    },

    oldValue: {
      type: String,
      default: null,
    },

    newValue: {
      type: String,
      default: null,
    },

    performedBy: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true, // student / admin / system
    },

    timestamp: {
      type: Date,
      default: Date.now,
      index: true,
    },
  },
  {
    versionKey: false,
  }
);

export default models.ComplaintHistory ||
  model("ComplaintHistory", ComplaintHistorySchema);
