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
        "ESCALATED",
        "RESOLVED",
      ],
      index: true,
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
    remark: {
      type: String,
      default: null,
    }

  },
  {
    versionKey: false,
  }
);

export default models.ComplaintHistory ||
  model("ComplaintHistory", ComplaintHistorySchema);
