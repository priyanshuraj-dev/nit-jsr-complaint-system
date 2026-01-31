import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
    },

    role: {
      type: String,
      required: true,
      enum: ["STUDENT", "ADMIN", "SUPER_ADMIN"],
    },

    registrationNumber: {
      type: String,
      default: null, // only students will send this
    },

    department: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
