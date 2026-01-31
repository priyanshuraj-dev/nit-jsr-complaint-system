import mongoose, { Schema, model, models } from "mongoose";

const UserSchema = new Schema(
  {
    name: String,

    email: {
      type: String,
      unique: true,
      required: true,
    },

    password: {
      type: String,
      default: null, // null for Google users
      required: true,
    },

    role: {
      type: String,
      enum: ["STUDENT", "ADMIN", "SUPER_ADMIN"],
      required: true,
    },

    registrationNumber: {
      type: String,
      default: null,
    },
  },
  { timestamps: true }
);

export default models.User || model("User", UserSchema);
